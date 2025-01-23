import { deepSeekClient } from '@/lib/deepSeekClient';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { messages } = await req.json();
    
    const completion = await deepSeekClient.chat.completions.create({
      model: 'deepseek-chat',  // replace with actual model name
      messages,
    });

    return NextResponse.json(completion.choices[0].message);
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 