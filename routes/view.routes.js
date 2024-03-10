var express = require('express')
var requireAuth = require('../middleware/auth.middleware')
const Sections = require('../schemas/sections.schema')
const Courses = require('../schemas/courses.schema')
var router = express.Router()

/* GET home page. */
router.get('/login', function (req, res) {
  if (req.session.memberId) res.redirect('/dashboard')
  else res.render('login', { title: 'Login', message: req.query.msg })
})

router.get('/dashboard', requireAuth, async (req, res) => {
  const data = await Sections.find({})
    .populate({
      path: 'course',
      select: 'courseName',
    })
    .lean()
    .exec()
  const courses = await Courses.find({}).lean().exec()
  const sections = data.map((value, index) => {
    return {
      id: value._id,
      sectionName: value.sectionName,
      sectionDescription: value.sectionDescription,
      duration: value.duration,
      isMainTask: value.isMainTask,
      course: value.course,
      number: index,
      coursesList: courses.map((course) => {
        return {
          id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          currentCourse: value.course._id.toString() === course._id.toString(),
        }
      }),
    }
  })
  res.render('dashboard', {
    title: 'Sections',
    sections: sections,
    courses: courses,
    message: req.query.message,
  })
})

module.exports = router
