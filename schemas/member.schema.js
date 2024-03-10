const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const MembersSchema = new Schema(
  {
    username: { type: String, isRequired: true },
    password: { type: String, isRequiredtype: true },
  },
  {
    timestamps: true,
  }
)

MembersSchema.pre('save', async function (next) {
  const user = this
  const hash = await bcrypt.hash(this.password, 10)

  this.password = hash
  next()
})

MembersSchema.methods.isValidPassword = async function (password) {
  const user = this
  const compare = await bcrypt.compare(password, user.password)

  return compare
}

const Members = model('Members', MembersSchema)

module.exports = { Members, MembersSchema }
