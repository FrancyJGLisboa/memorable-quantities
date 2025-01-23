import deepSeekClient from '../../../lib/deepSeekClient';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { messages, stream = false } = await req.json();

    // Ensure system message is present
    const systemMessage = messages.find(m => m.role === 'system');
    if (!systemMessage) {
      messages.unshift({ 
        role: "system", 
        content: "You are a helpful assistant." 
      });
    }

    const completion = await deepSeekClient.chat.completions.create({
      messages,
      model: "deepseek-chat",
      stream,
    });

    if (stream) {
      // Handle streaming response
      return new Response(completion.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Handle regular response
    return NextResponse.json({
      content: completion.choices[0].message.content,
      message: completion.choices[0].message,
    });

  } catch (error) {
    console.error('DeepSeek API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    );
  }
} 