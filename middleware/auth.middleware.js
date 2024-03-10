var passport = require('passport')
var { Members } = require('../schemas/member.schema')
var localStrategy = require('passport-local').Strategy
var JWTstrategy = require('passport-jwt').Strategy
var ExtractJWT = require('passport-jwt').ExtractJwt
passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const member = await Members.create({ username, password })

        return done(null, member)
      } catch (error) {
        done(error)
      }
    }
  )
)

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const member = await Members.findOne({ username })
        if (!member) {
          return done(null, false, { message: 'Member not found' })
        }

        const validate = await member.isValidPassword(password)

        if (!validate) {
          return done(null, false, { message: 'Wrong Password' })
        }

        return done(null, member, { message: 'Logged in Successfully' })
      } catch (error) {
        return done(error)
      }
    }
  )
)

passport.use(
  new JWTstrategy(
    {
      secretOrKey: 'TOP_SECRET',
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user)
      } catch (error) {
        done(error)
      }
    }
  )
)

const requireAuth = (req, res, next) => {
  if (req.session.memberId) {
    next() // User is authenticated, continue to next middleware
  } else {
    res.redirect('/login') // User is not authenticated, redirect to login page
  }
}

module.exports = requireAuth
