// Environment variables wrapper
export const env = {
  // OpenAI
  OPENAI_API_KEY:
    process.env.OPENAI_API_KEY ||
    "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",

  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51RQGzyFKWwuhRAJgWJMdpz90RBdRZAVWdS2cCvSPWbDm8G42UN1pWD2EoIJgcd0cnVL3fcM50T4m6E0rsYkkut9j004SxcaNnS",
}
