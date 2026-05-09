import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    teamSize: { type: Number, required: true },
    auditId: { type: mongoose.Schema.Types.ObjectId, ref: 'Audit' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
