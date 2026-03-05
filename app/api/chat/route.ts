import { HfInference } from "@huggingface/inference"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { message, conversationHistory } = await req.json()

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    // Initialize Hugging Face Inference
    const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

    // Prepare messages for the model
    const messages = [
      {
        role: "system",
        content: "You are an expert programming assistant specialized in teaching and explaining code. You help users learn programming languages like Java, C, C++, Python, and other computer science concepts. Provide clear, concise, and educational responses."
      },
      ...(conversationHistory || []),
      {
        role: "user",
        content: message
      }
    ]

    // Call Hugging Face Chat Completion API
    const response = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    })

    const botReply = response.choices[0].message.content

    return NextResponse.json({
      reply: botReply,
      model: "mistralai/Mistral-7B-Instruct-v0.2"
    })

  } catch (error) {
    console.error("Hugging Face API Error:", error)
    
    // Check if it's an authentication error
    let errorMessage = "Failed to get response from AI"
    let errorDetails = error instanceof Error ? error.message : "Unknown error"
    
    if (!process.env.HUGGINGFACE_API_KEY) {
      console.error("API Key is missing from environment variables")
      errorMessage = "Hugging Face API key is not configured"
    } else if (errorDetails.includes("401") || errorDetails.includes("Unauthorized")) {
      console.error("Invalid API key - check your Hugging Face token")
      errorMessage = "Invalid Hugging Face API key"
    } else if (errorDetails.includes("429")) {
      console.error("Rate limit exceeded")
      errorMessage = "Too many requests. Please wait a moment and try again."
    } else if (errorDetails.includes("503")) {
      console.error("Model unavailable")
      errorMessage = "AI model is temporarily unavailable. Please try again in a few moments."
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    )
  }
}
