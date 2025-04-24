import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { school_name, contact_email, interest_area } = req.body

  if (!school_name || !contact_email) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    // TODO: Replace with your Airtable API integration
    console.log('Logging to Airtable:', { school_name, contact_email, interest_area })

    res.status(200).json({ message: 'EOI logged successfully to Airtable' })
  } catch (error) {
    console.error('Error logging to Airtable:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
