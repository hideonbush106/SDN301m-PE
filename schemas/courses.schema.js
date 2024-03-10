const { Schema, model } = require('mongoose')

const CoursesSchema = new Schema(
  {
    courseName: { type: String, isRequired: true },
    courseDescription: { type: String, isRequired: true },
  },
  {
    timestamps: true,
  }
)

const Courses = model('Courses', CoursesSchema)

module.exports = Courses
