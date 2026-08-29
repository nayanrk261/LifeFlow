import mongoose from 'mongoose';

const familyMemberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  relationship: {
    type: String,
    required: true,
    enum: ['Father', 'Mother', 'Brother', 'Sister', 'Spouse', 'Son', 'Daughter', 'Grandfather', 'Grandmother', 'Other'],
    default: 'Other'
  },
  dateOfBirth: { type: String },
  notes: { type: String, trim: true }
}, { timestamps: true });

familyMemberSchema.index({ userId: 1 });

export default mongoose.model('FamilyMember', familyMemberSchema);
