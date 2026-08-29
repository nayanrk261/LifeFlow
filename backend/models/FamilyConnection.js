import mongoose from 'mongoose';

const familyConnectionSchema = new mongoose.Schema({
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  relationshipFromRequester: {
    type: String,
    required: true,
    enum: ['Father', 'Mother', 'Brother', 'Sister', 'Spouse', 'Son', 'Daughter', 'Grandfather', 'Grandmother', 'Other']
  },
  relationshipFromRecipient: {
    type: String,
    enum: ['Father', 'Mother', 'Brother', 'Sister', 'Spouse', 'Son', 'Daughter', 'Grandfather', 'Grandmother', 'Other']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

familyConnectionSchema.index({ requesterId: 1, recipientId: 1 });
familyConnectionSchema.index({ recipientId: 1, status: 1 });

export default mongoose.model('FamilyConnection', familyConnectionSchema);
