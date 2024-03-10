var express = require('express')
var Sections = require('../schemas/sections.schema')
var router = express.Router()
var createError = require('http-errors')
var { sectionValidation } = require('../utils/validator')
var { validationResult } = require('express-validator')

router.post('/', sectionValidation, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.redirect(`/dashboard?message=${errors.errors[0].msg}`)
    } else {
      await Sections.create({
        sectionName: req.body.sectionName,
        sectionDescription: req.body.sectionDescription,
        duration: req.body.duration,
        isMainTask: req.body.isMainTask == 'on' ? true : false,
        course: req.body.course,
      })
      res.redirect('/dashboard')
    }
  } catch (error) {
    console.log(error)
    res.json(createError(error))
  }
})

router.put('/:sectionId', sectionValidation, async (req, res) => {
  try {
    const errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
      res.render('dashboard')
    } else {
      await Sections.findByIdAndUpdate(
        req.params.sectionId,
        {
          sectionName: req.body.sectionName,
          sectionDescription: req.body.sectionDescription,
          duration: req.body.duration,
          isMainTask: req.body.isMainTask == 'on' ? true : false,
          course: req.body.course,
        },
        {
          new: true,
        }
      )
      res.render('dashboard')
    }
  } catch (error) {
    res.json(
      createError(404, {
        error: `Not found with id: ${req.params.sectionId}`,
      })
    )
  }
})

router.delete('/:sectionId', async (req, res) => {
  try {
    const data = await Sections.findByIdAndDelete(req.params.sectionId)
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
