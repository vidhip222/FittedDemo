import { NextResponse } from "next/server"

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY
const MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    if (!HUGGINGFACE_API_KEY) {
      return NextResponse.json(
        { error: "Hugging Face API key not configured" },
        { status: 500 }
      )
    }

    const response = await fetch(MODEL_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `<s>[INST] You are a fashion stylist assistant. Help the user with their fashion-related questions. Be concise and helpful. [/INST] ${message}</s>`,
        parameters: {
          max_new_tokens: 250,
          temperature: 0.7,
          top_p: 0.95,
          repetition_penalty: 1.1,
        },
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to get response from Hugging Face API")
    }

    const data = await response.json()
    return NextResponse.json({ response: data[0].generated_text })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    )
  }
} 