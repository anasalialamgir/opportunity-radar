export interface AIRequest {
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIProvider {
  name: string;
  generateText(input: AIRequest): Promise<string>;
  structuredOutput<T>(input: AIRequest): Promise<T>;
}

export interface StructuredCV {
  skills: {
    technical: string[];
    soft: string[];
    domain: string[];
  };
  experience: {
    title: string;
    company?: string;
    years?: number;
    summary?: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year?: number;
  }[];
  certifications: {
    name: string;
    issuer?: string;
    year?: number;
  }[];
  languages: string[];
  links: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    website?: string;
  };
  location?: string;
}
