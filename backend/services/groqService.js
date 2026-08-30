import Groq from 'groq-sdk';

/**
 * Isolated Groq AI Service Layer
 */
class GroqService {
  constructor() {
    this.client = null;
  }

  getClient() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_groq_api_key')) {
      return null;
    }
    if (!this.client) {
      this.client = new Groq({ apiKey });
    }
    return this.client;
  }

  isConfigured() {
    return Boolean(this.getClient());
  }

  /**
   * Execute chat completion expecting structured JSON
   */
  async generateJSON({ systemPrompt, userPrompt, temperature = 0.2, modelName = null }) {
    const groq = this.getClient();
    if (!groq) {
      throw new Error('Groq API is not configured on the backend.');
    }

    const selectedModel = modelName || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    console.log(`Calling Groq model: ${selectedModel}`);

    try {
      const response = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        model: selectedModel,
        temperature: temperature,
        response_format: { type: 'json_object' }
      });

      const rawContent = response.choices?.[0]?.message?.content;
      if (!rawContent) {
        throw new Error('Empty response received from Groq AI.');
      }

      // Clean markdown formatting if returned
      const cleanContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanContent);
      return parsed;
    } catch (error) {
      console.error('Groq AI API error:', error.message);
      if (error.status === 429) {
        throw new Error('LifeFlow AI is temporarily busy. Please try again in a moment.');
      }
      if (error.status === 401) {
        throw new Error('Invalid Groq API key configured on backend.');
      }
      throw error;
    }
  }

  /**
   * Execute chat completion expecting raw text / markdown
   */
  async generateText({ systemPrompt, userPrompt, temperature = 0.3, modelName = null }) {
    const groq = this.getClient();
    if (!groq) {
      throw new Error('Groq API is not configured on the backend.');
    }

    const selectedModel = modelName || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    console.log(`Calling Groq model: ${selectedModel}`);

    try {
      const response = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        model: selectedModel,
        temperature: temperature,
      });

      const rawContent = response.choices?.[0]?.message?.content;
      if (!rawContent) {
        throw new Error('Empty response received from Groq AI.');
      }

      return rawContent.trim();
    } catch (error) {
      console.error('Groq AI API error:', error.message);
      if (error.status === 429) {
        throw new Error('LifeFlow AI is temporarily busy. Please try again in a moment.');
      }
      if (error.status === 401) {
        throw new Error('Invalid Groq API key configured on backend.');
      }
      throw error;
    }
  }
}

export const groqService = new GroqService();
