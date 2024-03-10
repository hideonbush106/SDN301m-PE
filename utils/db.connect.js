var mongoose = require('mongoose')

const dbConnect = async (url) => {
  try {
    await mongoose.connect(url)
    console.log('[💾] Database connected successfully')
  } catch (error) {
    console.log(error)
  }
}

module.exports = dbConnect
