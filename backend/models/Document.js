import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  documentType: { type: String, trim: true },
  category: { type: String, enum: ['Government', 'Education', 'Financial', 'Personal', 'Other'], default: 'Other' },
  source: { type: String, trim: true },
  status: { type: String, enum: ['healthy', 'expiring', 'attention', 'missing', 'not-available'], default: 'healthy' },
  issueDate: { type: String },
  expiryDate: { type: String },
  number: { type: String, trim: true },
  issuedBy: { type: String, trim: true },
  extractedData: { type: mongoose.Schema.Types.Mixed },
  aiSummary: { type: String },
  actionRequired: { type: Boolean, default: false },
  action: { type: String },
  priority: { type: String, enum: ['high', 'medium', 'low', null], default: null },

  // Privacy & Explicit Document Sharing
  visibility: { type: String, enum: ['private', 'shared'], default: 'private' },
  sharedWith: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    permission: { type: String, enum: ['view'], default: 'view' },
    sharedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

documentSchema.index({ userId: 1 });
documentSchema.index({ 'sharedWith.userId': 1 });

export default mongoose.model('Document', documentSchema);
