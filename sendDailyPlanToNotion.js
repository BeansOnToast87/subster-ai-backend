import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { date, priorities } = req.body

  if (!date || !priorities) {
    return res.status(400).json({ message: 'Missing date or priorities' })
  }

  try {
    // TODO: Replace with your Notion API integration
    console.log('Sending to Notion:', { date, priorities })

    res.status(200).json({ message: 'Daily plan sent to Notion' })
  } catch (error) {
    console.error('Error sending to Notion:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
