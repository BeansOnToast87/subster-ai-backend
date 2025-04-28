require('dotenv').config();
const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { date, priorities } = req.body;

  if (!date || !priorities || !Array.isArray(priorities)) {
    return res.status(400).json({ message: 'Missing or invalid fields' });
  }

  try {
    await notion.pages.create({
      parent: { database_id: '1e1b5b68a0c5808990bef57ba744e2e3' },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: `Plan for ${date}`,
              },
            },
          ],
        },
        Date: {
          date: {
            start: date,
          },
        },
        Priorities: {
          rich_text: [
            {
              text: {
                content: priorities.join(', '),
              },
            },
          ],
        },
      },
    });

    return res.status(200).json({ message: 'Daily plan logged to Notion successfully' });
  } catch (error) {
    console.error('Error logging to Notion:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
