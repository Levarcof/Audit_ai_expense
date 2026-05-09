
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Audit from '@/models/Audit';
import { runAudit } from '@/utils/auditEngine';
import { generateAISummary } from '@/services/aiSummary';
import crypto from 'crypto';

export async function POST(req) {
  try {
    const body = await req.json();
    const { tools } = body;

    // Validation
    if (!tools || !Array.isArray(tools) || tools.length === 0) {
      return NextResponse.json(
        { error: 'Tools data is required' },
        { status: 400 }
      );
    }

    // Run audit engine
    const auditResults = runAudit(tools);

    // Generate AI summary safely
    let aiSummary = '';

    try {
      aiSummary = await generateAISummary(auditResults);
    } catch (error) {
      console.error('AI Summary Failed:', error.message);

      aiSummary =
        'Your AI stack shows potential optimization opportunities. Review the recommendations below to reduce unnecessary spending while maintaining productivity.';
    }

    // Connect DB
    await connectDB();

    // Create public shareable ID
    const publicId = crypto.randomBytes(8).toString('hex');

    // Save audit
    const newAudit = await Audit.create({
      tools,
      ...auditResults,
      aiSummary,
      publicId,
    });

    return NextResponse.json(
      {
        success: true,
        id: newAudit.publicId,
        audit: {
          monthlySavings: auditResults.monthlySavings,
          annualSavings: auditResults.annualSavings,
          recommendations: auditResults.recommendations,
          aiSummary,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Audit API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

