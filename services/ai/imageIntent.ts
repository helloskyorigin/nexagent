/**
 * Image Generation Intent Detector
 * Deterministically classifies natural language queries to detect image generation intent
 * without requiring the user to manually select "Create image" tool first.
 */

export interface ImageIntentResult {
  isImageIntent: boolean;
  cleanedPrompt: string;
  suggestedStyle?: string;
  suggestedAspectRatio?: string;
}

export function detectImageIntent(input: string): ImageIntentResult {
  if (!input || typeof input !== 'string') {
    return { isImageIntent: false, cleanedPrompt: '' };
  }

  const raw = input.trim();
  if (raw.length === 0) {
    return { isImageIntent: false, cleanedPrompt: '' };
  }

  const lower = raw.toLowerCase();

  // 1. Definite negative filters (pure explanations, questions, programming code requests)
  // E.g. "What is a black hole?", "Explain how rockets work", "Why does...", "How do I..."
  if (
    /^(what|why|who|where|when|which|how\s+come|is\s+it|can\s+you\s+explain|explain|tell\s+me\s+about)\b/i.test(lower) &&
    !/^(can\s+you|could\s+you|please|would\s+you)\s+(create|generate|make|draw|paint|render|illustrate|produce)\s+(an?\s+)?(image|picture|photo|illustration|artwork|drawing|painting|render|visual)/i.test(lower)
  ) {
    return { isImageIntent: false, cleanedPrompt: raw };
  }

  // Coding/technical instructions about images (e.g. "how to draw in canvas", "image tag in html", "create an image component in react")
  if (
    /\b(in\s+(react|javascript|typescript|python|html|css|canvas|svg|tailwind|node|c\+\+|java|flutter|swift|next\.js)|code|function|component|library|api|script|syntax|algorithm|regex)\b/i.test(lower) &&
    /\b(how|write|implement|create|generate|make|build|optimize)\b/i.test(lower) &&
    !/^(create|generate|make|draw|render)\s+(an?\s+)?(cinematic|futuristic|cyberpunk|anime|3d|photorealistic)?\s*(image|picture|photo|illustration|artwork|drawing)/i.test(lower)
  ) {
    return { isImageIntent: false, cleanedPrompt: raw };
  }

  // General questions like "explain how to draw", "explain image generation"
  if (/^explain\s+(how\s+to\s+draw|how\s+image|how\s+rockets|black\s+holes?|quantum|gravity|photosynthesis|the\s+difference)/i.test(lower)) {
    return { isImageIntent: false, cleanedPrompt: raw };
  }

  // 2. Positive intent patterns
  const patterns: RegExp[] = [
    // (Please / Can you) Create/Generate/Make/Produce/Render (a/an) (cinematic/etc.) image/picture/photo/photograph/illustration/artwork/drawing/painting/render of/for/showing...
    /^(?:please\s+|can\s+you\s+|could\s+you\s+|would\s+you\s+)?(?:create|generate|make|produce|render)\s+(?:an?\s+)?(?:cinematic|photorealistic|futuristic|cyberpunk|anime|watercolor|oil\s+painting|3d(?:\s+render)?|digital\s+art|sketch|realistic|vintage|retro)?\s*(?:image|picture|photo|photograph|illustration|artwork|drawing|painting|render|visual|graphic|wallpaper|avatar|portrait|banner)\s+(?:of|for|showing|with|depicting)?\s*(.+)$/i,

    // Draw / Paint / Sketch / Illustrate / Render (me) (a/an) ...
    /^(?:please\s+|can\s+you\s+|could\s+you\s+|would\s+you\s+)?(?:draw|paint|sketch|illustrate)\s+(?:me\s+)?(?:an?\s+)?(.+)$/i,

    // Visualize ...
    /^(?:please\s+|can\s+you\s+|could\s+you\s+|would\s+you\s+)?(?:visualize)\s+(?:an?\s+)?(.+)$/i,

    // "Create a futuristic Tesla-like car", "Generate a cyberpunk city", "Make a futuristic space station"
    /^(?:please\s+|can\s+you\s+|could\s+you\s+|would\s+you\s+)?(?:create|generate|make)\s+(?:an?\s+)?(?:futuristic|cinematic|cyberpunk|photorealistic|3d(?:\s+render)?|anime|surreal|hyperrealistic|pixel\s+art|watercolor|oil\s+painting|isometric|vector|minimalist)\s+(.+)$/i,

    // "Make an illustration of a rocket launching", "Create artwork of a sunset"
    /^(?:please\s+|can\s+you\s+|could\s+you\s+|would\s+you\s+)?(?:create|generate|make)\s+(?:an?\s+)?(?:artwork|illustration|drawing|picture|photo|portrait|wallpaper|painting)\s+(?:of|for|showing|with|depicting)?\s*(.+)$/i,

    // "Image of ...", "Picture of ...", "Photo of ...", "Illustration of ..."
    /^(?:image|picture|photo|illustration|drawing|artwork|render)\s+of\s+(.+)$/i,
  ];

  for (const pattern of patterns) {
    if (pattern.test(raw)) {
      // The user wants an image generated!
      // Keep the full original user prompt intact as required
      return {
        isImageIntent: true,
        cleanedPrompt: raw,
      };
    }
  }

  return { isImageIntent: false, cleanedPrompt: raw };
}
