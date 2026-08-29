import mongoose from 'mongoose';

const requirementSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, trim: true, default: 'General' },
  required: { type: Boolean, default: true },
  description: { type: String, trim: true },
  acceptedDocTypes: [{ type: String }],
  status: { type: String, enum: ['available', 'missing', 'optional', 'in_progress'], default: 'missing' },
  matchedDocumentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', default: null },
  matchedFamilyDocumentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', default: null },
  matchedFamilyMemberName: { type: String, default: null }
});

const actionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed'], default: 'Not Started' },
  dueDate: { type: Date },
  completedAt: { type: Date }
});

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalUserRequest: { type: String, trim: true },
  processType: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, trim: true, default: 'General' },
  description: { type: String, trim: true },
  status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
  readinessScore: { type: Number, default: 0, min: 0, max: 100 },
  nextBestAction: { type: String, trim: true },
  aiExplanation: { type: String, trim: true },
  deadline: { type: Date },
  requirements: [requirementSchema],
  actions: [actionSchema]
}, { timestamps: true });

goalSchema.index({ userId: 1, status: 1 });

export default mongoose.model('Goal', goalSchema);
