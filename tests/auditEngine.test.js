const { runAudit } = require('../utils/auditEngine');

describe('Audit Engine', () => {
  test('1. ChatGPT Team with 2 seats should recommend Plus', () => {
    const tools = [{
      name: 'ChatGPT',
      plan: 'Team',
      monthlySpend: 60,
      seats: 2,
      teamSize: 2,
      useCase: 'Coding',
    }];
    const result = runAudit(tools);
    expect(result.recommendations[0].recommendedPlan).toBe('Plus');
    expect(result.monthlySavings).toBeGreaterThan(0);
  });

  test('2. ChatGPT Team with 5 seats should NOT recommend Plus', () => {
    const tools = [{
      name: 'ChatGPT',
      plan: 'Team',
      monthlySpend: 150,
      seats: 5,
      teamSize: 5,
      useCase: 'Writing',
    }];
    const result = runAudit(tools);
    expect(result.recommendations[0].recommendedPlan).toBe('Team');
    expect(result.monthlySavings).toBe(0);
  });

  test('3. Cursor Business with 1 seat should recommend Pro', () => {
    const tools = [{
      name: 'Cursor',
      plan: 'Business',
      monthlySpend: 40,
      seats: 1,
      teamSize: 1,
      useCase: 'Coding',
    }];
    const result = runAudit(tools);
    expect(result.recommendations[0].recommendedPlan).toBe('Pro');
    expect(result.recommendations[0].savings).toBe(20);
  });

  test('4. ChatGPT Enterprise for small team (15 people) should recommend Team', () => {
    const tools = [{
      name: 'ChatGPT',
      plan: 'Enterprise',
      monthlySpend: 300,
      seats: 5,
      teamSize: 15,
      useCase: 'Mixed',
    }];
    const result = runAudit(tools);
    expect(result.recommendations[0].recommendedPlan).toBe('Team');
    expect(result.monthlySavings).toBeGreaterThan(0);
  });

  test('5. Annual savings should be 12x monthly savings', () => {
    const tools = [{
      name: 'Cursor',
      plan: 'Business',
      monthlySpend: 40,
      seats: 1,
      teamSize: 1,
      useCase: 'Coding',
    }];
    const result = runAudit(tools);
    expect(result.annualSavings).toBe(result.monthlySavings * 12);
  });

  test('6. Multiple tools accumulate total spend correctly', () => {
    const tools = [
      { name: 'ChatGPT', plan: 'Team', monthlySpend: 60, seats: 2, teamSize: 2, useCase: 'Writing' },
      { name: 'Cursor', plan: 'Business', monthlySpend: 40, seats: 1, teamSize: 1, useCase: 'Coding' },
    ];
    const result = runAudit(tools);
    expect(result.totalSpend).toBe(100);
    expect(result.monthlySavings).toBeGreaterThan(0);
    expect(result.recommendations).toHaveLength(2);
  });

  test('7. Optimal plans produce zero savings', () => {
    const tools = [{
      name: 'ChatGPT',
      plan: 'Team',
      monthlySpend: 90,
      seats: 3,
      teamSize: 3,
      useCase: 'Research',
    }];
    const result = runAudit(tools);
    expect(result.recommendations[0].savings).toBe(0);
    expect(result.monthlySavings).toBe(0);
    expect(result.annualSavings).toBe(0);
  });

  test('8. GitHub Copilot Enterprise for small team should recommend Business', () => {
    const tools = [{
      name: 'GitHub Copilot',
      plan: 'Enterprise',
      monthlySpend: 195,
      seats: 5,
      teamSize: 5,
      useCase: 'Coding',
    }];
    const result = runAudit(tools);
    expect(result.recommendations[0].recommendedPlan).toBe('Business');
    expect(result.monthlySavings).toBeGreaterThan(0);
  });
});
