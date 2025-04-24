require('dotenv').config();
const Airtable = require('airtable');

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { school_name, contact_email, interest_area } = req.body;

  if (!school_name || !contact_email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    await base(process.env.AIRTABLE_TABLE_NAME).create([
      {
        fields: {
          School: school_name,
          Interest: interest_area,
          Email: contact_email,
        },
      },
    ]);

    return res.status(200).json({ message: 'EOI logged successfully to Airtable' });
  } catch (error) {
    console.error('Airtable insert failed:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
