# Garden Concept Generator

Production-ready Next.js app for generating three realistic UK garden redesign concepts from uploaded garden photos.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- Zod schema validation
- OpenAI Responses API (swappable provider architecture)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env template:
   ```bash
   cp .env.example .env.local
   ```
3. Add your API key in `.env.local`.
4. Run dev server:
   ```bash
   npm run dev
   ```

## Environment variables
See `.env.example`.

## Scripts
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`

## Provider switching
`lib/ai/provider.ts` defines the `AiProvider` interface. To switch AI vendor, implement a new provider class with `generateStructuredJson(prompt, images)` and inject it into `generateGardenConcepts`.
