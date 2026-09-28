# AI 3D Model Generator

An AI-powered web application that converts natural language prompts into interactive 3D models.

## 🚀 Live Demo

https://ai-3d-model-generator-zeta.vercel.app/

## 📦 Source Code

https://github.com/vaibhov22/ai-3d-model-generator

## ✨ Features

- Generate 3D models from text prompts
- AI-powered text-to-3D generation
- Interactive 3D preview
- Rotate and zoom the model
- Download generated models as `.glb`
- Responsive modern UI
- Example prompts for quick testing
- Error handling for temporary API rate limits
- Deployed on Vercel

## 🛠️ Tech Stack

- Next.js
- TypeScript
- React
- React Three Fiber
- Three.js
- Drei
- Tailwind CSS
- AI Text-to-3D API
- Vercel

## 🏗️ How It Works

1. User enters a natural-language description.
2. The Next.js API route sends the prompt to the AI text-to-3D service.
3. The service generates a `.glb` 3D model.
4. The application polls the generation status.
5. The generated model is loaded into the React Three Fiber viewer.
6. Users can rotate, zoom, and download the model.

## 📁 Project Structure

```text
ai-3d-model-generator/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts
│   ├── components/
│   │   └── ModelViewer.tsx
│   ├── page.tsx
│   └── layout.tsx
├── public/
├── package.json
├── tsconfig.json
└── README.md