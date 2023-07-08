const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name : String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  credit: {
    type: Number,
    default: 10
  }
})

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema)
export default UserModel
