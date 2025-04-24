import { google } from 'googleapis';
import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), 'google-service-account.json'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const { date, metric, value } = req.body;

    const spreadsheetId = '1BCNlFFWWdeIPa_cfN8s21awGghV0KQf91UiAEIcGCBs';
  // <- We'll change this next
    const range = 'Sheet1!A:C'; // This assumes your sheet has 3 columns: Date, Metric, Value

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[date, metric, value]],
      },
    });

    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error('Error updating Google Sheet:', error);
    res.status(500).json({ error: error.message });
  }
}
