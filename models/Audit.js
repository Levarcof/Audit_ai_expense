import mongoose from 'mongoose';

const AuditSchema = new mongoose.Schema(
  {
    tools: [
      {
        name: { type: String, required: true },
        plan: { type: String, required: true },
        monthlySpend: { type: Number, required: true },
        seats: { type: Number, required: true },
        teamSize: { type: Number, required: true },
        useCase: { type: String, required: true },
      },
    ],
    totalSpend: { type: Number, required: true },
    totalOptimizedSpend: { type: Number, required: true },
    monthlySavings: { type: Number, required: true },
    annualSavings: { type: Number, required: true },
    recommendations: [
      {
        toolName: { type: String, required: true },
        currentPlan: { type: String, required: true },
        recommendedPlan: { type: String, required: true },
        reason: { type: String, required: true },
        savings: { type: Number, required: true },
        annualSavings: { type: Number, required: true },
        optimizedSpend: { type: Number, required: true },
      },
    ],
    aiSummary: { type: String },
    publicId: { type: String, required: true, unique: true, index: true },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compiling the model if it already exists
export default mongoose.models.Audit || mongoose.model('Audit', AuditSchema);
