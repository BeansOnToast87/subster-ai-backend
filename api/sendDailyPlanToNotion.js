const { Client } = require("@notionhq/client");

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { date, priorities } = req.body;

  if (!date || !priorities || !Array.isArray(priorities)) {
    return res.status(400).json({ message: 'Missing or invalid date or priorities' });
  }

  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    const databaseId = process.env.NOTION_DATABASE_ID;

    const results = [];

    for (const task of priorities) {
      const response = await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: task,
                },
              },
            ],
          },
          Date: {
            date: {
              start: date,
            },
          },
        },
      });

      results.push(response.id);
    }

    res.status(200).json({ message: 'Tasks sent to Notion', results });
  } catch (error) {
    console.error('Error sending to Notion:', error.message);
    res.status(500).json({ error: error.message });
  }
}
