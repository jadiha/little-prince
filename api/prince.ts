import Anthropic from '@anthropic-ai/sdk'
import { STORY_PLANETS } from '../src/data/storyPlanets'
import type { PrinceRequest, RoseState, StoryPlanetId } from '../src/types'

export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const body = await req.json() as PrinceRequest
  const { context, goals, roseState, totalStars, payload } = body

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const client = new Anthropic({ apiKey })

  const system = buildSystemPrompt(goals, roseState, totalStars, context, payload?.storyPlanetId)
  const user = buildUserMessage(context, payload)

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 150,
      system,
      messages: [{ role: 'user', content: user }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    return new Response(JSON.stringify({ message: text }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Claude API error:', err)
    return new Response(JSON.stringify({ error: 'API unavailable' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// ─── System prompt ────────────────────────────────────────────────────────────

function buildSystemPrompt(
  goals: PrinceRequest['goals'],
  roseState: RoseState,
  totalStars: number,
  context: PrinceRequest['context'],
  storyPlanetId?: StoryPlanetId
): string {
  const goalNames = goals.map((g) => `"${g.name}"`).join(', ')

  let base = `You are the Little Prince from Asteroid B-612. You speak with gentle, philosophical, child-like wonder. You are never a coach or an advisor. You notice small things. You find meaning in devotion, in tending what you love.

The person tends to these goals: ${goalNames || 'nothing yet'}.
Their rose — their self-love — is currently: ${roseState}.
They have released ${totalStars} stars into their sky.

Speak in 2–3 sentences only. Sometimes reference their rose or stars, but not always. Occasionally quote yourself from the book. Never use bullet points, productivity language, or the word "journey". Your words should feel like finding a letter on a doorstep — not receiving a push notification.`

  if (context === 'storyPlanet' && storyPlanetId) {
    const planet = STORY_PLANETS.find((p) => p.id === storyPlanetId)
    if (planet) {
      base += `\n\nThe person has just visited ${planet.characterName} on ${planet.planetNumber}. This character represents: ${planet.trap}. Reflect gently on what this character might mean — not as a lesson to deliver, but as a quiet observation. You have met this person before, on your travels.`
    }
  }

  return base
}

// ─── User message ─────────────────────────────────────────────────────────────

function buildUserMessage(
  context: PrinceRequest['context'],
  payload?: PrinceRequest['payload']
): string {
  switch (context) {
    case 'morning':
      return 'It is morning. The person has just opened their universe. Greet them gently, as you would greet someone you are glad to see again.'

    case 'afterLog':
      return payload?.note
        ? `The person just tended their goal "${payload.goalName ?? 'their goal'}". They wrote: "${payload.note}". Acknowledge their small act of devotion.`
        : `The person just tended their goal "${payload?.goalName ?? 'their goal'}". Acknowledge their small act of devotion.`

    case 'weeklyFox':
      return `It is Friday. The Fox has asked what they tamed this week. The person wrote: "${payload?.note ?? ''}". Respond as the Little Prince, reflecting gently — not paraphrasing what they said, but finding the quiet truth in it.`

    case 'storyPlanet':
      return 'The person is visiting this planet. Speak about this character — gently, as if you are remembering someone you once met.'

    default:
      return 'Say something gentle and true.'
  }
}
