import formidable from 'formidable';
import fs from 'fs';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req,
  res
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 解析文件上传
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

    // 读取文件内容（实际应用中可能直接处理文件）
    const fileContent = fs.readFileSync(uploadedFile.filepath, 'utf-8');
    
    // 在实际应用中，这里会调用CatBoost模型进行处理
    const processingResult = {
      filename: uploadedFile.originalFilename,
      size: uploadedFile.size,
      type: uploadedFile.mimetype,
      contentSample: fileContent.substring(0, 100) + '...',
      prediction: Math.random() > 0.5 ? 'Positive' : 'Negative',
      confidence: (Math.random() * 100).toFixed(2)
    };

    // 删除临时文件
    fs.unlinkSync(uploadedFile.filepath);

    res.status(200).json(processingResult);
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ 
      error: 'File upload failed',
      details: error.message 
    });
  }
}