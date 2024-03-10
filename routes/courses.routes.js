var express = require('express')
var Courses = require('../schemas/courses.schema')
var router = express.Router()
var createError = require('http-errors')
var { courseValidation } = require('../utils/validator')
var { validationResult } = require('express-validator')

router.get('/', async (req, res) => {
  try {
    const data = await Courses.find({})
    res.json(data)
  } catch (error) {
    console.log(error)
  }
})

router.get('/:courseId', async (req, res) => {
  try {
    const data = await Courses.findOne({
      _id: req.params.courseId,
    })
    res.json(data)
  } catch (error) {
    res.json(
      createError(404, {
        error: `Not found with id: ${req.params.courseId}`,
      })
    )
  }
})

router.post('/', courseValidation, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.json(createError(422, errors))
    }
    const data = await Courses.create(req.body)
    res.json(data)
  } catch (error) {
    console.log(error)
  }
})

router.put('/:courseId', courseValidation, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.json(createError(422, errors))
    }
    const data = await Courses.findByIdAndUpdate(
      req.params.courseId,
      req.body,
      {
        new: true,
      }
    )
    res.json(data)
  } catch (error) {
    res.json(
      createError(404, {
        error: `Not found with id: ${req.params.courseId}`,
      })
    )
  }
})

router.delete('/:courseId', async (req, res) => {
  try {
    const data = await Courses.findByIdAndDelete(req.params.courseId)
    if (!data) {
      res.json(
        createError(404, {
          error: `Not found with id: ${req.params.courseId}`,
        })
      )
    } else {
      res.json(data)
    }
  } catch (error) {
    res.json(
      createError(404, {
        error: `Not found with id: ${req.params.courseId}`,
      })
    )
  }
})
module.exports = router
