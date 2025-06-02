export default async function handler(
  req,
  res
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // URL验证
    const urlPattern = /^(https?):\/\/[^\s$.?#].[^\s]*$/;
    if (!urlPattern.test(url)) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // 使用 fetch 获取URL头信息
    const headResponse = await fetch(url, { method: 'HEAD' });
    
    if (!headResponse.ok) {
      return res.status(400).json({ error: 'Failed to access URL' });
    }
    
    const contentType = headResponse.headers.get('content-type') || 'unknown';
    const contentLength = headResponse.headers.get('content-length') || 'unknown';
    
    // 在实际应用中，这里会调用CatBoost模型进行处理
    const processingResult = {
      url,
      status: 'processed',
      contentType,
      contentLength,
      prediction: Math.random() > 0.5 ? 'Positive' : 'Negative',
      confidence: (Math.random() * 100).toFixed(2)
    };

    res.status(200).json(processingResult);
  } catch (error) {
    console.error('Error processing URL:', error);
    res.status(500).json({ 
      error: 'Failed to process URL',
      details: error.message 
    });
  }
}