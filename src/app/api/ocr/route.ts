import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { Category } from '@/types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(req: NextRequest) {
  try {
    const { base64Image } = await req.json();
    if (!base64Image) return NextResponse.json({ error: 'No image provided.' }, { status: 400 });
    if (!process.env.GEMINI_API_KEY) return NextResponse.json({ error: 'GEMINI_API_KEY not configured.' }, { status: 500 });

    const prompt = `Analyze this sales receipt. Extract ALL products: name, unit price, quantity.
Categorize each into: ${Object.values(Category).join(', ')}.
Use defaults if a field is missing (empty string or 1).`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image.split(',')[1] || base64Image } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  productName: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  quantity: { type: Type.NUMBER },
                  category: { type: Type.STRING },
                },
                required: ['productName', 'price', 'quantity', 'category'],
              },
            },
          },
          required: ['items'],
        },
      },
    });

    if (!response.text) return NextResponse.json({ error: 'Could not extract text.' }, { status: 422 });
    return NextResponse.json(JSON.parse(response.text));
  } catch (error) {
    console.error('OCR error:', error);
    return NextResponse.json({ error: 'Error analyzing image. Try a clearer photo.' }, { status: 500 });
  }
}