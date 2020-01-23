import express from 'express'
import bcrypt from 'bcrypt'
import generator from 'generate-password'
import jwt from 'jsonwebtoken'
import bodyParser from 'body-parser'
import api from '../api/user'
import { sendConfirmMail } from '../mailer'

let authRouter = express.Router({
  mergeParams: true
})

authRouter.use(bodyParser.json())

authRouter.post('/', (req,res,next) => {
  let new_user = true, user, token, confirmToken, pass
  const { email } = req.body.credentials
  const jwtOptions = {
    expiresIn: '240d',
  }
  const scope = ['username','userlast','uid','verified','credit','gender','bday','membership','language','status']
  api.checkOne(email,scope).then( results => {
// User exist:
    if(results.length > 0){
      const { uid } = results[0]
      token = jwt.sign({email:email,uid:uid},process.env.JWT_SECRET,jwtOptions)
      user = Object.assign({},{token: token, new_user: false},results[0])
      res.status(200).json({user})
    } else {
// User is new:
      confirmToken = jwt.sign({email},process.env.JWT_SECRET,jwtOptions)
      pass = generator.generate({
        length: 8,
        numbers: true
      })
// encrypt password and save it to DB:
      bcrypt.hash(pass, 8, (err,hash) => {
        if(!err){
          api.signup({email:email,password:hash,token:confirmToken})
          .then( id => {
// Send mail to User with confirmToken:
            sendConfirmMail(email,confirmToken)
            console.log('authRouter:',id)
// Generate Token for localStorage:
            token = jwt.sign({email:email,uid:id},process.env.JWT_SECRET,jwtOptions)
            user = Object.assign({},{token: token, new_user: true})
            res.status(200).json({user})
          })
          .catch( err => {
            res.status(500).json(err)
          })
        }
      })
    }
  })
  .catch(err => console.log(err))
})

authRouter.get('/confirmation/:token', (req,res,next) => {
  const { token } = req.params
  const decoded = jwt.decode(token)
  if( !decoded || decoded === null ) {
    console.log('Invalid verification token...')
    req.errr = { message: 'Invalid verification token...'}
    //next()
    res.redirect('/')
  } else {
    api.verify(decoded.email,['email']).then( rows => {
      if(rows === 0) {
        req.errr = {message: 'No such user'}
      }
    //next()
    res.redirect('/')
    })
    .catch( err => ({message: 'Something went wrong'}) )
  }
})

export default authRouter
