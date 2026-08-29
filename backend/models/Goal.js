import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  processType: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, trim: true },
  status: { type: String, enum: ['active', 'completed', 'paused'], default: 'active' },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  requirements: [{
    name: { type: String },
    status: { type: String, enum: ['available', 'missing', 'optional'], default: 'missing' },
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  }],
  deadline: { type: String },
}, { timestamps: true });

goalSchema.index({ userId: 1 });

export default mongoose.model('Goal', goalSchema);
