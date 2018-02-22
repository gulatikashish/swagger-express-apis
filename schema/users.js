var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema(
  {
    name: String,
    password: { type: String },
    email_id: { type: String, required: true }
  },
  { collection: 'users' }
)

module.exports = mongoose.model('users', userSchema)
