import { TOOLS_PRICING } from '../data/pricing.js';

/**
 * Audit Engine logic to calculate potential savings
 * Based on deterministic rules and current market pricing
 */
export function runAudit(tools = []) {
  let totalSpend = 0;
  let totalOptimizedSpend = 0;

  const recommendations = [];

  tools.forEach((tool) => {
    const {
      name,
      plan,
      monthlySpend = 0,
      seats = 1,
      teamSize = 1,
      useCase = '',
    } = tool;

    // Standardize key for lookup
    const toolKey = name?.toUpperCase()?.replace(' ', '_');
    const pricingData = TOOLS_PRICING[toolKey];

    // Validate tool exists in pricing
    if (!pricingData) {
      totalSpend += Number(monthlySpend);
      totalOptimizedSpend += Number(monthlySpend);
      return;
    }

    totalSpend += Number(monthlySpend);

    let toolRec = {
      toolName: name,
      currentPlan: plan,
      recommendedPlan: plan,
      recommendationType: 'optimized',
      reason: 'Your current plan is already optimized for your current usage.',
      currentSpend: Number(monthlySpend),
      optimizedSpend: Number(monthlySpend),
      savings: 0,
      annualSavings: 0,
    };

    /*
    ============================================
    CHATGPT LOGIC
    ============================================
    */

    if (name === 'ChatGPT') {
      // Team -> Plus
      if (plan === 'Team' && seats <= 2) {
        const optimizedPrice = (pricingData.plans?.PLUS?.price || 20) * seats;

        const savings = Math.max(Number(monthlySpend) - optimizedPrice, 0);

        toolRec = {
          ...toolRec,
          recommendedPlan: 'Plus',
          recommendationType: 'downgrade',
          optimizedSpend: optimizedPrice,
          savings,
          annualSavings: savings * 12,
          reason:
            'ChatGPT Team is usually unnecessary for teams with fewer than 3 users. Individual Plus accounts provide similar value at lower cost.',
        };
      }

      // Enterprise -> Team
      else if (plan === 'Enterprise' && teamSize < 20) {
        const optimizedPrice = (pricingData.plans?.TEAM?.price || 30) * seats;

        const savings = Math.max(Number(monthlySpend) - optimizedPrice, 0);

        toolRec = {
          ...toolRec,
          recommendedPlan: 'Team',
          recommendationType: 'downgrade',
          optimizedSpend: optimizedPrice,
          savings,
          annualSavings: savings * 12,
          reason:
            'Enterprise plans are typically excessive for teams under 20 users. Team plans offer collaboration features at significantly lower cost.',
        };
      }
    }

    /*
    ============================================
    CURSOR LOGIC
    ============================================
    */

    if (name === 'Cursor') {
      // Business -> Pro
      if (plan === 'Business' && seats === 1) {
        const optimizedPrice = pricingData.plans?.PRO?.price || 20;

        const savings = Math.max(Number(monthlySpend) - optimizedPrice, 0);

        toolRec = {
          ...toolRec,
          recommendedPlan: 'Pro',
          recommendationType: 'downgrade',
          optimizedSpend: optimizedPrice,
          savings,
          annualSavings: savings * 12,
          reason:
            'Cursor Pro includes nearly all core AI coding features needed for solo developers at a much lower cost.',
        };
      }
    }

    /*
    ============================================
    CLAUDE LOGIC
    ============================================
    */

    if (name === 'Claude') {
      // Team -> Pro
      if (plan === 'Team' && seats < 5) {
        const optimizedPrice = (pricingData.plans?.PRO?.price || 20) * seats;

        const savings = Math.max(Number(monthlySpend) - optimizedPrice, 0);

        toolRec = {
          ...toolRec,
          recommendedPlan: 'Pro',
          recommendationType: 'downgrade',
          optimizedSpend: optimizedPrice,
          savings,
          annualSavings: savings * 12,
          reason:
            'Claude Team plans are generally most cost-effective for larger collaborative teams. Smaller teams benefit more from individual Pro subscriptions.',
        };
      }

      // Claude alternative recommendation (Cross-tool recommendation)
      if (useCase.toLowerCase() === 'coding' && monthlySpend > 100) {
        const cursorPricing = TOOLS_PRICING.CURSOR;
        const optimizedPrice = (cursorPricing?.plans?.PRO?.price || 20) * seats;

        const savings = Math.max(Number(monthlySpend) - optimizedPrice, 0);

        if (savings > toolRec.savings) {
          toolRec = {
            ...toolRec,
            recommendedPlan: 'Cursor Pro',
            recommendationType: 'alternative',
            optimizedSpend: optimizedPrice,
            savings,
            annualSavings: savings * 12,
            reason:
              'For coding-focused teams, Cursor Pro often delivers better code-generation workflows at significantly lower cost.',
          };
        }
      }
    }

    /*
    ============================================
    GITHUB COPILOT LOGIC
    ============================================
    */

    if (name === 'GitHub Copilot') {
      // Enterprise -> Business
      if (
        plan === 'Enterprise' &&
        useCase.toLowerCase() === 'coding' &&
        teamSize < 10
      ) {
        const optimizedPrice = (pricingData.plans?.BUSINESS?.price || 19) * seats;

        const savings = Math.max(Number(monthlySpend) - optimizedPrice, 0);

        toolRec = {
          ...toolRec,
          recommendedPlan: 'Business',
          recommendationType: 'downgrade',
          optimizedSpend: optimizedPrice,
          savings,
          annualSavings: savings * 12,
          reason:
            'GitHub Copilot Enterprise features are often unnecessary for smaller engineering teams. Business plans cover most practical coding workflows.',
        };
      }
    }

    /*
    ============================================
    GEMINI LOGIC
    ============================================
    */

    if (name === 'Gemini') {
      if ((plan === 'Ultra' || plan === 'Enterprise') && teamSize < 5) {
        const optimizedPrice = (pricingData.plans?.BUSINESS?.price || 20) * seats;

        const savings = Math.max(Number(monthlySpend) - optimizedPrice, 0);

        toolRec = {
          ...toolRec,
          recommendedPlan: 'Business',
          recommendationType: 'downgrade',
          optimizedSpend: optimizedPrice,
          savings,
          annualSavings: savings * 12,
          reason:
            'Gemini Enterprise is typically intended for power users and enterprise workflows. Gemini Business is more economical for smaller teams.',
        };
      }
    }

    /*
    ============================================
    OPENAI API LOGIC
    ============================================
    */

    if (name === 'OpenAI API') {
      if (monthlySpend > 300 && useCase.toLowerCase() === 'mixed') {
        const optimizedPrice = monthlySpend * 0.7; // Estimated 30% savings

        const savings = Math.max(Number(monthlySpend) - optimizedPrice, 0);

        toolRec = {
          ...toolRec,
          recommendedPlan: 'Usage Optimization',
          recommendationType: 'optimization',
          optimizedSpend: optimizedPrice,
          savings,
          annualSavings: savings * 12,
          reason:
            'Your API usage appears inefficient. Better prompt management, caching, and model routing could significantly reduce costs.',
        };
      }
    }

    /*
    ============================================
    FINALIZE
    ============================================
    */

    totalOptimizedSpend += Number(toolRec.optimizedSpend);
    recommendations.push(toolRec);
  });

  const monthlySavings = Math.max(totalSpend - totalOptimizedSpend, 0);
  const annualSavings = monthlySavings * 12;

  return {
    totalSpend,
    totalOptimizedSpend,
    monthlySavings,
    annualSavings,
    recommendations,
  };
}

