const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_OCR_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

if (!NVIDIA_API_KEY) {
  console.warn('[v0] NVIDIA_API_KEY not found. OCR functionality will not work.');
}

export async function extractTextFromImage(imageBase64) {
  if (!NVIDIA_API_KEY) {
    throw new Error('NVIDIA_API_KEY is not configured. Please add it to your environment variables.');
  }

  try {
    const response = await fetch(NVIDIA_OCR_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'nvidia/nemoretriever-ocr-v1',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              },
              {
                type: 'text',
                text: 'Extract all text from this image.'
              }
            ]
          }
        ],
        max_tokens: 1024,
        temperature: 0.2,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`NVIDIA OCR API error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('[v0] NVIDIA OCR error:', error);
    throw error;
  }
}
