import mongoose from 'mongoose';

const familyInvitationSchema = new mongoose.Schema({
  inviterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientEmail: { type: String, lowercase: true, trim: true },
  relationship: {
    type: String,
    required: true,
    enum: ['Father', 'Mother', 'Brother', 'Sister', 'Spouse', 'Son', 'Daughter', 'Grandfather', 'Grandmother', 'Other']
  },
  secureTokenHash: { type: String, required: true },
  plainToken: { type: String }, // For development display if needed
  expiresAt: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'cancelled', 'expired'],
    default: 'pending'
  }
}, { timestamps: true });

familyInvitationSchema.index({ inviterId: 1 });
familyInvitationSchema.index({ secureTokenHash: 1 });

export default mongoose.model('FamilyInvitation', familyInvitationSchema);
