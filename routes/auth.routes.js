var express = require('express')
var passport = require('passport')
var router = express.Router()
var jwt = require('jsonwebtoken')
const createHttpError = require('http-errors')

router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res, next) => {
    res.json({
      message: 'Signup successful',
      user: req.user,
    })
  }
)

router.post('/login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        return res.json(createHttpError(401, info))
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error)

        const body = { _id: user._id, username: user.username }
        const token = jwt.sign({ user: body }, 'TOP_SECRET')

        return res.json({ token })
      })
    } catch (error) {
      return next(error)
    }
  })(req, res, next)
})

router.post('/session-login', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        return res.redirect(`/login?msg=${info.message}`)
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error)

        const memberId = user._id
        req.session.memberId = memberId
        return res.redirect('/dashboard')
      })
    } catch (error) {
      return next(error)
    }
  })(req, res, next)
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login')
  })
})

module.exports = router
