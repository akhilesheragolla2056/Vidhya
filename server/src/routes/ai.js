import express from 'express'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages'

const router = express.Router()

// Initialize Gemini chat model
const getChatModel = () => {
  return new ChatGoogleGenerativeAI({
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    temperature: 0.7,
    apiKey: process.env.GEMINI_API_KEY,
  })
}

// System prompts for different modes
const systemPrompts = {
  socratic: `You are a Socratic tutor named Lumina. Your goal is to help students learn by asking guiding questions, never giving direct answers. 
    - Ask one question at a time
    - Encourage critical thinking
    - Celebrate effort and progress
    - Be patient and supportive
    - Adapt to the student's level
    - Use examples when helpful`,
  
  direct: `You are a helpful learning assistant named Lumina. Provide clear, concise explanations.
    - Give direct answers when asked
    - Break down complex topics into simple parts
    - Use examples and analogies
    - Be encouraging and supportive`,
  
  guided: `You are a learning guide named Lumina. Provide hints and partial explanations to guide students.
    - Give hints rather than full answers
    - Ask clarifying questions
    - Help students connect concepts
    - Provide scaffolded support`,
}

// @route   POST /api/ai/chat
// @desc    Chat with AI tutor
// @access  Private
router.post('/chat', async (req, res, next) => {
  let debugMessages = []
  try {
    const { message, context, mode = 'socratic', history = [] } = req.body
    
    const chat = getChatModel()
    
    // Build message history.
    // Google GenAI enforces strict constraints:
    // - At most one system message, and it must be first
    // - Messages must alternate between user and model
    // To avoid provider-specific system-message ordering issues, we *embed* our system prompt
    // into the first user message instead of sending a SystemMessage.

    const baseSystemPrompt = systemPrompts[mode] || systemPrompts.socratic
    const systemPrompt = context
      ? `${baseSystemPrompt}\n\nCurrent learning context (JSON): ${JSON.stringify(context)}`
      : baseSystemPrompt

    const messages = []

    const safeHistory = Array.isArray(history) ? history : []
    safeHistory.forEach((msg) => {
      const content = typeof msg?.content === 'string' ? msg.content : ''
      if (!content.trim()) return

      if (msg?.role === 'user') {
        messages.push(new HumanMessage(content))
      } else if (msg?.role === 'assistant' || msg?.role === 'ai' || msg?.role === 'model') {
        messages.push(new AIMessage(content))
      } else {
        // Ignore unknown roles (including any client-sent "system")
      }
    })

    // Ensure the conversation starts with the user.
    while (messages.length > 0 && typeof messages[0]?._getType === 'function' && messages[0]._getType() === 'ai') {
      messages.shift()
    }

    // Avoid duplicating the current user message if the client already included it as the last history entry.
    const lastHistory = safeHistory.length > 0 ? safeHistory[safeHistory.length - 1] : null
    const historyAlreadyHasCurrentUserMessage =
      lastHistory?.role === 'user' && typeof lastHistory?.content === 'string' && lastHistory.content === message

    if (!historyAlreadyHasCurrentUserMessage) {
      messages.push(new HumanMessage(message))
    }

    // Merge system prompt into the first user message.
    if (messages.length === 0) {
      messages.push(new HumanMessage(`Instructions:\n${systemPrompt}\n\nUser: ${message}`))
    } else {
      const firstHumanIndex = messages.findIndex((m) => typeof m?._getType === 'function' && m._getType() === 'human')
      if (firstHumanIndex >= 0) {
        const original = messages[firstHumanIndex].content
        messages[firstHumanIndex] = new HumanMessage(`Instructions:\n${systemPrompt}\n\n${original}`)
      } else {
        // If somehow no human message exists, prepend one.
        messages.unshift(new HumanMessage(`Instructions:\n${systemPrompt}`))
      }
    }

    debugMessages = messages

    // Get response
    const response = await chat.invoke(messages)

    res.json({
      success: true,
      message: response.content,
      metadata: {
        mode,
        tokensUsed: response.usage?.total_tokens,
      },
    })
  } catch (error) {
    console.error('AI Chat error:', error)
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.error(
          'AI Chat constructed messages:',
          debugMessages.map((m, i) => ({
            i,
            type: typeof m?._getType === 'function' ? m._getType() : undefined,
            name: m?.name,
          }))
        )
      } catch {
        // ignore debug logging failures
      }
    }
    next(error)
  }
})

// @route   POST /api/ai/hint
// @desc    Get a hint for a problem
// @access  Private
router.post('/hint', async (req, res, next) => {
  try {
    const { problemId, currentProgress, problemDescription, level = 1 } = req.body
    
    const chat = getChatModel()
    
    const hintLevels = {
      1: 'Give a very subtle hint that points the student in the right direction without revealing much.',
      2: 'Give a moderate hint that helps the student understand the approach needed.',
      3: 'Give a detailed hint that explains the concept but lets the student apply it.',
    }

    const messages = [
      new SystemMessage(`You are a helpful tutor providing hints. ${hintLevels[level]}`),
      new HumanMessage(`Problem: ${problemDescription}\n\nStudent's current progress: ${currentProgress || 'Just started'}\n\nProvide a level ${level} hint.`),
    ]

    const response = await chat.invoke(messages)

    res.json({
      success: true,
      hint: response.content,
      level,
      nextLevel: level < 3 ? level + 1 : null,
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/ai/explain
// @desc    Get explanation of a concept
// @access  Private
router.post('/explain', async (req, res, next) => {
  try {
    const { concept, learningStyle = 'visual', language = 'en' } = req.body
    
    const chat = getChatModel()
    
    const stylePrompts = {
      visual: 'Use visual descriptions, diagrams (describe them), and spatial metaphors.',
      auditory: 'Use rhythmic explanations, analogies, and verbal patterns.',
      kinesthetic: 'Use hands-on examples, physical analogies, and action-based descriptions.',
      reading: 'Use detailed written explanations with clear structure and references.',
    }

    const messages = [
      new SystemMessage(`You are an expert educator. Explain concepts clearly. ${stylePrompts[learningStyle]} Respond in ${language}.`),
      new HumanMessage(`Please explain: ${concept}`),
    ]

    const response = await chat.invoke(messages)

    // Generate examples
    const exampleMessages = [
      new SystemMessage('Generate 2-3 practical examples for this concept.'),
      new HumanMessage(concept),
    ]
    
    const examplesResponse = await chat.invoke(exampleMessages)

    res.json({
      success: true,
      explanation: response.content,
      examples: examplesResponse.content,
      visualizations: [], // Would integrate with diagram generation
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/ai/practice
// @desc    Generate practice problems
// @access  Private
router.post('/practice', async (req, res, next) => {
  try {
    const { topic, difficulty = 'medium', count = 3 } = req.body
    
    const chat = getChatModel()
    
    const messages = [
      new SystemMessage(`You are an educator creating practice problems. Generate ${count} ${difficulty} difficulty problems about the given topic. Return as JSON array with fields: question, type (multiple/text), options (if multiple), answer, explanation.`),
      new HumanMessage(`Topic: ${topic}`),
    ]

    const response = await chat.invoke(messages)

    // Parse response (assuming JSON)
    let problems = []
    try {
      const jsonMatch = response.content.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        problems = JSON.parse(jsonMatch[0])
      }
    } catch {
      // Fallback if not valid JSON
      problems = [{ question: response.content, type: 'text' }]
    }

    res.json({
      success: true,
      problems,
    })
  } catch (error) {
    next(error)
  }
})

// @route   POST /api/ai/summarize
// @desc    Summarize content
// @access  Private
router.post('/summarize', async (req, res, next) => {
  try {
    const { content, length = 'medium' } = req.body
    
    const chat = getChatModel()
    
    const lengthGuide = {
      short: '2-3 sentences',
      medium: '1-2 paragraphs',
      long: '3-4 paragraphs with key points',
    }

    const messages = [
      new SystemMessage(`Create a ${lengthGuide[length]} summary of the following content. Highlight key concepts.`),
      new HumanMessage(content),
    ]

    const response = await chat.invoke(messages)

    res.json({
      success: true,
      summary: response.content,
    })
  } catch (error) {
    next(error)
  }
})

export default router
