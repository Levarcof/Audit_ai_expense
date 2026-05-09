/**
 * service/aiSummary.js
 * Comprehensive logic for generating a personalized AI summary with fallbacks.
 */

export async function generateAISummary(auditData) {
  const { recommendations, monthlySavings, annualSavings } = auditData;

  const prompt = `
    Analyze this AI tool spend audit for a small team:
    - Potential Monthly Savings: $${monthlySavings}
    - Potential Annual Savings: $${annualSavings}
    - Key Recommendations: ${recommendations.map(r => `${r.toolName}: ${r.recommendedPlan}`).join(', ')}

    Provide a concise, professional summary (80-120 words) explaining where the overspending is happening,
    and why these optimizations make sense for a finance-conscious startup.
  `.trim();

  // Try Groq first
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
      }),
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices[0].message.content;
    }
  } catch (error) {
    console.error('Groq API Error:', error.message);
  }

  // Try OpenRouter Fallback
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const data = await response.json();
      return data.choices[0].message.content;
    }
  } catch (error) {
    console.error('OpenRouter API Error:', error.message);
  }

  // Hardcoded Fallback Template
  return `
    Your AI stack evaluation reveals a significant opportunity for optimization, potentially saving you up to $${annualSavings} per year. 
    By right-sizing plans for tools like ${recommendations[0]?.toolName || 'your AI tools'} and addressing seat inefficiencies, 
    your startup can maintain full productivity while drastically reducing overhead. 
    We recommend immediate downgrades to more efficient tiers to preserve capital for growth.
  `.trim();
}
