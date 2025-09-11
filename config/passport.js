const passport = require("passport")
const LocalStrategy = require("passport-local")
const bcrypt = require("bcryptjs")
const User = require("../models/user")

module.exports = app => {
  app.use(passport.initialize())
  // app.use(passport.session())

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport .deserializeUser((user, done) => {
    User.findById(id)
    .lean()
    .then(user => done(null, user))
    .catch(err => done(err, null))
  })

  passport.use(new LocalStrategy({ usernameField: "email"}, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if(!user) {
          return done(null, false, { message: "該使用者信箱尚未註冊!" })
        }

        return bcrypt.compare(password, user.password).then(isMatch =>{
          if(!isMatch) {
            return done(null, false, {message: "信箱/密碼不正確!"})
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))
}