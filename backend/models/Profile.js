import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  age: { type: Number },
  dateOfBirth: { type: String },
  state: { type: String, trim: true },
  city: { type: String, trim: true },
  occupation: { type: String, trim: true },
  ownsVehicle: { type: Boolean, default: false },
  studying: { type: Boolean, default: false },
  hasPassport: { type: Boolean, default: false },
  hasDrivingLicence: { type: Boolean, default: false },
  preparingForApplication: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
