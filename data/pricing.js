export const TOOLS_PRICING = {
  CURSOR: {
    name: 'Cursor',
    plans: {
      PRO: { name: 'Pro', price: 20 },
      BUSINESS: { name: 'Business', price: 40, minSeats: 1 },
    },
  },
  CHATGPT: {
    name: 'ChatGPT',
    plans: {
      PLUS: { name: 'Plus', price: 20 },
      TEAM: { name: 'Team', price: 30, minSeats: 2 },
      ENTERPRISE: { name: 'Enterprise', price: 60, minSeats: 10 },
    },
  },
  CLAUDE: {
    name: 'Claude',
    plans: {
      PRO: { name: 'Pro', price: 20 },
      TEAM: { name: 'Team', price: 30, minSeats: 5 },
    },
  },
  GITHUB_COPILOT: {
    name: 'GitHub Copilot',
    plans: {
      INDIVIDUAL: { name: 'Individual', price: 10 },
      BUSINESS: { name: 'Business', price: 19 },
      ENTERPRISE: { name: 'Enterprise', price: 39 },
    },
  },
  GEMINI: {
    name: 'Gemini',
    plans: {
      ADVANCED: { name: 'Advanced', price: 20 },
      BUSINESS: { name: 'Business', price: 20, minSeats: 1 },
      ENTERPRISE: { name: 'Enterprise', price: 30, minSeats: 1 },
    },
  },
  OPENAI_API: {
    name: 'OpenAI API',
    plans: {
      USAGE: { name: 'Pay as you go', price: 0 },
    },
  },
  ANTHROPIC_API: {
    name: 'Anthropic API',
    plans: {
      USAGE: { name: 'Pay as you go', price: 0 },
    },
  },
  WINDSURF: {
    name: 'Windsurf',
    plans: {
      PRO: { name: 'Pro', price: 20 },
    },
  },
};

export const USE_CASES = [
  'Coding',
  'Writing',
  'Research',
  'Data Analysis',
  'Mixed',
];
