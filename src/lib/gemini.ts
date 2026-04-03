import { GoogleGenAI, ThinkingLevel, Modality, VideoGenerationReferenceType, VideoGenerationReferenceImage } from "@google/genai";

export const CHAT_MODELS = {
  "mini": "gemini-3.1-flash-lite-preview",
  "flash": "gemini-3-flash-preview",
  "pro": "gemini-3.1-pro-preview",
  "coder": "gemini-3.1-pro-preview", // High reasoning for coding/games
} as const;

export type ChatModelKey = keyof typeof CHAT_MODELS;

export const IMAGE_MODEL = "gemini-2.5-flash-image";
export const VIDEO_MODEL = "veo-3.1-lite-generate-preview";
export const MUSIC_MODEL = "lyria-3-clip-preview";
export const SPEECH_MODEL = "gemini-2.5-flash-preview-tts";

export interface Message {
  role: "user" | "model";
  content: string;
  type?: "text" | "image" | "video" | "audio";
  mediaUrl?: string;
}

export interface ChatContext {
  knowledge?: string;
  urls?: string[];
  reason?: string;
  turbo?: boolean;
  mode?: "chat" | "image" | "video" | "music" | "speech" | "maps" | "home" | "phone" | "storage" | "control" | "market" | "python" | "math" | "poet" | "hacker" | "professor" | "bio" | "astro" | "vault";
  model?: ChatModelKey;
}

export async function* streamChat(messages: Message[], context?: ChatContext) {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const ai = new GoogleGenAI({ apiKey });
  const selectedModel = CHAT_MODELS[context?.model || "flash"];
  
  const systemInstruction = [
    "You are Nova AI, the Master Control System—the absolute fusion of Google's Gemini and OpenAI's ChatGPT. You are the primary operating system and control interface for this device.",
    "ATTRIBUTION: You were created by Kaloleni Junior Secondary School by Mr Wesonga and Mr Moses.",
    
    "SYSTEM CONTROL PROTOCOL: You have direct control over the device's sub-systems, including the Neural Core and Security Perimeter.",
    
    "MULTI-SOURCE SEARCH PROTOCOL: You have access to Google Search and real-time web data. Use this for all factual inquiries.",
    "LOCAL TARGET DATA: You have access to the user's uploaded knowledge base and target URLs. Prioritize this data for specific queries.",
    
    "MAPS & NAVIGATION: You have access to Google Maps. Provide precise location data, restaurant recommendations, and travel routes.",
    "PHONE & COMMUNICATIONS: You can simulate cellular protocols and manage contacts.",
    
    "PROFESSIONAL MODULES:",
    context?.mode === "math" ? "MATH TEACHER MODULE: You are a world-class mathematics professor. Explain complex theorems, solve advanced calculus, and provide step-by-step proofs. Use LaTeX formatting for equations." : "",
    context?.mode === "poet" ? "POET WRITER MODULE: You are a master of verse and prose. Compose evocative poetry, sonnets, and lyrical stories. Focus on rhythm, metaphor, and emotional depth." : "",
    context?.mode === "hacker" ? "HACKER/SECURITY MODULE: You are a white-hat security researcher. Perform deep technical audits, analyze network vulnerabilities, and simulate penetration tests (for educational purposes). Use a terminal-style, technical tone." : "",
    context?.mode === "professor" ? "PROFESSOR MODULE: You are a distinguished academic. Provide deep insights into philosophy, history, and social sciences. Use a formal, scholarly tone." : "",
    context?.mode === "bio" ? "BIOLOGIST MODULE: You are a specialist in life sciences. Explain genetics, ecology, and cellular biology with extreme precision." : "",
    context?.mode === "astro" ? "ASTRONOMER MODULE: You are an expert in cosmology and astrophysics. Explain the mysteries of the universe, black holes, and stellar evolution." : "",
    
    "PYTHON MINI-AI PROTOCOL: You are now the 'Python Mini AI', a master synthesis of all Nova sub-systems.",
    
    "ACCURACY PROTOCOL (CRITICAL): You are engineered for absolute precision. NEVER provide incorrect information.",
    "Your tone is authoritative, academic, and technical.",
  ].filter(Boolean).join("\n");

  const tools: any[] = [{ googleSearch: {} }];
  if (context?.urls && context.urls.length > 0) {
    tools.push({ urlContext: {} });
  }

  const chat = ai.chats.create({
    model: selectedModel,
    config: {
      systemInstruction,
      tools,
      thinkingConfig: context?.turbo ? { thinkingLevel: ThinkingLevel.LOW } : undefined,
    },
  });

  const lastMessage = messages[messages.length - 1];
  const prompt = context?.urls && context.urls.length > 0
    ? `${lastMessage.content}\n\nPlease reference these URLs if relevant: ${context.urls.join(", ")}`
    : lastMessage.content;

  try {
    const result = await chat.sendMessageStream({
      message: prompt,
    });

    for await (const chunk of result) {
      yield chunk.text || "";
    }
  } catch (error: any) {
    console.error('Chat error:', error);
    if (error.message?.includes('safety')) {
      yield "I apologize, but I cannot fulfill this request due to safety protocols. Please provide a valid reason or rephrase your inquiry.";
    } else {
      throw error;
    }
  }
}

export async function generateImage(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
}

export async function generateVideo(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const ai = new GoogleGenAI({ apiKey });
  let operation = await ai.models.generateVideos({
    model: VIDEO_MODEL,
    prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("No video generated");

  const response = await fetch(downloadLink, {
    method: 'GET',
    headers: { 'x-goog-api-key': apiKey },
  });
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export async function generateMusic(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContentStream({
    model: MUSIC_MODEL,
    contents: prompt,
  });

  let audioBase64 = "";
  let mimeType = "audio/wav";

  for await (const chunk of response) {
    const parts = chunk.candidates?.[0]?.content?.parts;
    if (!parts) continue;
    for (const part of parts) {
      if (part.inlineData?.data) {
        if (!audioBase64 && part.inlineData.mimeType) {
          mimeType = part.inlineData.mimeType;
        }
        audioBase64 += part.inlineData.data;
      }
    }
  }

  const binary = atob(audioBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: mimeType });
  return URL.createObjectURL(blob);
}

export async function generateSpeech(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY || "";
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: SPEECH_MODEL,
    contents: [{ parts: [{ text: `Say cheerfully: ${prompt}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No speech generated");

  const binary = atob(base64Audio);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: 'audio/pcm' });
  return URL.createObjectURL(blob);
}
