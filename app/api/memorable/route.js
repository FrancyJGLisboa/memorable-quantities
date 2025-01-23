import { NextResponse } from 'next/server';
import deepSeekClient from '../../../lib/deepSeekClient';

// Standard reference measurements for precise comparisons
const REFERENCE_MEASUREMENTS = {
  general: {
    "shipping container (20ft)": { weight: 2300, units: "kg" },
    "olympic swimming pool": { volume: 2500, units: "m3" },
    "football field": { length: 100, units: "m" }
  },
  animals: {
    "blue whale (adult)": { weight: 140000, units: "kg" },
    "african elephant (adult)": { weight: 6000, units: "kg" },
    "giraffe (adult)": { height: 5.5, units: "m" }
  },
  sports: {
    "soccer ball (FIFA standard)": { weight: 0.45, units: "kg" },
    "olympic swimming pool": { length: 50, units: "m" },
    "tennis court": { area: 260.87, units: "m2" }
  },
  everyday: {
    "standard brick": { weight: 2.7, units: "kg" },
    "car tire": { weight: 11, units: "kg" },
    "sheet of A4 paper": { weight: 0.005, units: "kg" }
  },
  food: {
    "bag of flour (standard)": { weight: 1, units: "kg" },
    "grain of rice": { weight: 0.029, units: "g" },
    "gallon of milk": { volume: 3.78541, units: "L" }
  },
  tech: {
    "smartphone (avg)": { weight: 0.17, units: "kg" },
    "laptop (avg)": { weight: 2.2, units: "kg" },
    "4K movie file": { size: 100, units: "GB" }
  }
};

const LANGUAGE_PROMPTS = {
  en: {
    prefix: "Original",
    units: "Units",
    equivalent: "Equivalent",
    calculation: "Calculation"
  },
  pt: {
    prefix: "Original",
    units: "Unidades",
    equivalent: "Equivalente",
    calculation: "Cálculo"
  }
  // Add other languages as needed
};

export const runtime = 'edge'; // Enable edge runtime for streaming

export async function POST(req) {
  try {
    const { userText, comparisonType = 'general', language = 'en' } = await req.json();

    if (!userText) {
      return NextResponse.json(
        { message: 'Missing userText' },
        { status: 400 }
      );
    }

    // Clean up input text
    const cleanedText = userText
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/\u2013|\u2014/g, '-')
      .replace(/\u2026/g, '...')
      .replace(/\s+/g, ' ')
      .trim();

    const references = REFERENCE_MEASUREMENTS[comparisonType] || REFERENCE_MEASUREMENTS.general;

    const response = await deepSeekClient.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `You are a specialized assistant that helps make quantities more memorable through clear comparisons.

            Task: Read the following text and identify significant quantities. Create memorable comparisons to help visualize these quantities.
            Text: "${cleanedText}"

            Requirements:
            1. Respond in ${language.toUpperCase()}
            2. Focus on the most important quantities
            3. Use clear, everyday language
            4. Make comparisons that are:
               - Easy to visualize
               - Mathematically accurate
               - Related to the ${comparisonType} category when possible
            5. Show calculations in parentheses
            6. Keep the tone natural and engaging

            Here's exactly how your response should look:

            ${language === 'pt' ? 
              `Sumário: O texto discute o crescimento da indústria automotiva chinesa, destacando como a empresa BYD levou uma década para desenvolver sua tecnologia de troca de baterias.

              Quantidades Memoráveis:
              • 10 anos de desenvolvimento = Equivalente ao comprimento de 10 contêineres de transporte (20ft) alinhados (cálculo: 10 anos ≈ 10 contêineres × 20ft = 200ft de progresso linear)
              • 500 milhões de investimento = Peso equivalente a 185.185 tijolos padrão empilhados (cálculo: 500.000.000 ÷ 2.7kg por tijolo = 185.185 tijolos)`
              :
              `Summary: The text discusses China's automotive industry growth, highlighting how BYD took a decade to develop their battery swapping technology.

              Memorable Quantities:
              • 10 years of development = Length equivalent to 10 shipping containers (20ft) lined up (calculation: 10 years ≈ 10 containers × 20ft = 200ft of linear progress)
              • 500 million investment = Weight equivalent to 185,185 standard bricks stacked (calculation: 500,000,000 ÷ 2.7kg per brick = 185,185 bricks)`
            }

            Available reference measurements for comparisons:
            ${JSON.stringify(references, null, 2)}`
        }
      ],
      temperature: 0.3,
      max_tokens: 1000,
      presence_penalty: 0.0,
      frequency_penalty: 0.0,
      stream: false,
    });

    const result = response.choices[0].message.content;
    return NextResponse.json({ result });

  } catch (error) {
    console.error('DeepSeek API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    );
  }
} 