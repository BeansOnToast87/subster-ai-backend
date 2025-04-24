require('dotenv').config();
const Airtable = require('airtable');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { school_name, contact_email, interest_area } = req.body;

  if (!school_name || !contact_email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

    await base(process.env.AIRTABLE_TABLE_NAME).create([
      {
        fields: {
          School: school_name,
          Email: contact_email,
          Interest: interest_area || ''
        }
      }
    ]);

    return res.status(200).json({ message: 'EOI logged successfully to Airtable' });
  } catch (error) {
    console.error('Error logging to Airtable:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
