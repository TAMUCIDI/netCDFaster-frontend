import formidable from 'formidable';
import fs from 'fs';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse file upload
    const form = new IncomingForm();
    
    const data = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const uploadedFile = data.files.file;
    
    if (!uploadedFile) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get backend URL from environment
    const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:5000';
    const apiTimeout = parseInt(process.env.API_TIMEOUT) || 30000;

    // Read file as buffer
    const fileBuffer = fs.readFileSync(uploadedFile.filepath);
    
    // Create boundary for multipart/form-data
    const boundary = '----formdata-node-' + Math.random().toString(36);
    
    // Create multipart body manually
    const chunks = [];
    chunks.push(`--${boundary}\r\n`);
    chunks.push(`Content-Disposition: form-data; name="file"; filename="${uploadedFile.originalFilename}"\r\n`);
    chunks.push(`Content-Type: ${uploadedFile.mimetype || 'application/octet-stream'}\r\n\r\n`);
    
    const header = Buffer.from(chunks.join(''));
    const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
    
    const body = Buffer.concat([header, fileBuffer, footer]);

    // Call Flask backend API
    const backendResponse = await fetch(`${backendUrl}/file/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length.toString(),
      },
      body: body,
      signal: AbortSignal.timeout(apiTimeout)
    });

    // Clean up temporary file
    fs.unlinkSync(uploadedFile.filepath);

    if (!backendResponse.ok) {
      const errorData = await backendResponse.text();
      return res.status(backendResponse.status).json({ 
        error: 'Backend API error',
        details: errorData 
      });
    }

    const result = await backendResponse.json();
    res.status(200).json(result);

  } catch (error) {
    console.error('File upload error:', error);
    
    // Handle timeout specifically
    if (error.name === 'TimeoutError') {
      return res.status(408).json({ 
        error: 'Request timeout',
        details: 'Backend API call timed out' 
      });
    }
    
    res.status(500).json({ 
      error: 'File upload failed',
      details: error.message 
    });
  }
}