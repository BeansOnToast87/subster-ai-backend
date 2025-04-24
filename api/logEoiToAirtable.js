require('dotenv').config();
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { school_name, contact_email, interest_area } = req.body;

  if (!school_name || !contact_email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME;

  const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  const body = JSON.stringify({
    fields: {
      School: school_name,
      Email: contact_email,
      Interest: interest_area || ""
    }
  });

  try {
    const airtableRes = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    if (!airtableRes.ok) {
      const error = await airtableRes.text();
      throw new Error(`Airtable error: ${error}`);
    }

    return res.status(200).json({ message: 'EOI logged successfully to Airtable' });
  } catch (error) {
    console.error('Error logging to Airtable:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
