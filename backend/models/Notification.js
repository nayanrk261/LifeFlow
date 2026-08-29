import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  message: { type: String, trim: true },
  type: { type: String, enum: ['info', 'warning', 'urgent', 'success'], default: 'info' },
  read: { type: Boolean, default: false },
  relatedEntity: { type: String }, // e.g. 'family_request', 'document_expiry', 'scholarship'
  actionPayload: { type: mongoose.Schema.Types.Mixed }, // e.g. { connectionId: "...", requesterName: "..." }
}, { timestamps: true });

notificationSchema.index({ userId: 1, read: 1 });

export default mongoose.model('Notification', notificationSchema);
