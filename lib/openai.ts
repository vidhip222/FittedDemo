import OpenAI from "openai"
import { env } from "./env"

// Server-side OpenAI instance
let openai: OpenAI | null = null

export const getOpenAI = () => {
  if (!openai && env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    })
  }
  return openai
}
