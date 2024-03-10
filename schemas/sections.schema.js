const { Schema, model } = require('mongoose')

const SectionsSchema = new Schema(
  {
    sectionName: { type: String, isRequired: true },
    sectionDescription: { type: String, isRequired: true },
    duration: { type: Number, isRequired: true },
    isMainTask: { type: Boolean, default: false },
    course: { type: Schema.Types.ObjectId, ref: 'Courses', isRequired: true },
  },
  {
    timestamps: true,
  }
)

const Sections = model('Sections', SectionsSchema)

module.exports = Sections
