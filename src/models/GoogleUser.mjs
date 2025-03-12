import mongoose from 'mongoose';

const googleUserSchema = new mongoose.Schema({
  googleId: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  displayName: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
});

const GoogleUser = mongoose.model('GoogleUser', googleUserSchema);
export default GoogleUser;
