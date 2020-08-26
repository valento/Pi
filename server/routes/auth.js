import express from 'express'
import bcrypt from 'bcrypt'
import generator from 'generate-password'
import jwt from 'jsonwebtoken'
import bodyParser from 'body-parser'
import api from '../api/user'
import { sendConfirmMail } from '../mailer'
import { getUser } from '../middleware/'

let authRouter = express.Router({
  mergeParams: true
})

authRouter.use(bodyParser.json())

authRouter.post('/', (req,res,next) => {
  let new_user = true, user, uname,
      token, confirmToken, pass, role, member
  const { email } = req.body.credentials
  console.log(email.split('.')[0])
// Tester User:
  const [ t,...rest ] = email.split('@')[0].split('.')
// Check ROLE-USER: (baker,tester,boss)
  switch( email.split('.')[0] ) {
    case 'boss':
      role = email.split('.')[0]
      member = 1
      uname = 'Boss Valento'
    break
    case 'baker':
      role = email.split('.')[0]
      member = 8
      uname = rest.join('.')
    break
    case 'tester':
      role = email.split('.')[0]
      member = 64
      uname = rest.join('.')
    break
    default: role = null
  }
  //if(tester) {  }

  const jwtOptions = { expiresIn: '240d' }
  const scope = [
    'username','userlast','uid','verified','orders','credit',
    'gender','bday','membership','language','status'
  ]
  api.checkOne( email,scope ).then( results => {
// --- Login -> User exist but No token: ---
    if(results.length > 0){
      const { uid } = results[0]
      //user = Object.assign({},{token: token, new_user: false},results[0])

      try {
        api.getOne({ email: email },'user',scope)
        .then( results => {
          if(results.length === 0) return res.status(401).json({error: {message: 'User Not Found'}})

          //let user = {}
          const {
            uid,username,userlast,verified,orders,credit,
            gender,bday,membership,language,status,...rest
          } = results[0]

          token = jwt.sign({email:email,uid:uid,member:membership},process.env.JWT_SECRET,jwtOptions)

          user = Object.assign({},{token: token, new_user: false},{
            uid,username,userlast,verified,orders,credit,
            gender,bday,membership,language,status
          })

          if(results.length > 1){
            user.locations =[]
            results.forEach( ent => {
              const {mobile,name,location,city,admin,door,floor,bell,id,entry,prime,c_status} = ent
              if(c_status === 4){
                user.locations.push({mobile,name,location,city,admin,door,floor,bell,id,entry,prime}
              )}
            })
          } else {
            if( rest.id !== null ){
              user.locations =[]
              user.locations.push(rest)
            }
          }
          res.status(200).json({user})
        })
      } catch(err) {
        res.status(500).json({ error: { message: err }})
      }
    }
// --- SignUp -> New User: ---
    else {
      console.log('Insert New User',role)
// Generate Pass and Confirmation Token:
      confirmToken = jwt.sign({ email },process.env.JWT_SECRET,jwtOptions)
      pass = generator.generate({
        length: 8,
        numbers: true
      })
      let u = role ? {username: uname, membership: member} : {}
      console.log('Object to Insert: ',u)
// encrypt password and save it to DB:
      bcrypt.hash(pass, 8, (err,hash) => {
        if(!err){
          try {
            api.signup(Object.assign({email:email,password:hash,token:confirmToken},u))
            .then( id => {
  // Send mail to User with confirmToken:
              sendConfirmMail(email,confirmToken)
              console.log('authRouter:',id,member)
  // Generate Access User Token for localStorage:

              try {
                api.getOne({ email: email },'user',scope)
                .then( results => {
                  if(results.length === 0) return res.status(401).json({error: {message: 'User Not Found'}})
                  const {
                    uid,username,userlast,verified,orders,credit,
                    gender,bday,membership,language,status,...rest
                  } = results[0]

                  token = jwt.sign({email:email,uid:id,member:membership},process.env.JWT_SECRET,jwtOptions)

                  user = Object.assign({},{token: token, new_user: true},{
                    uid,username,userlast,verified,orders,credit,
                    gender,bday,membership,language,status
                  })

                  res.status(200).json({user})
                })
              } catch(err) {
                res.status(500).json({ error: { message: err }})
              }

            })
          } catch(err) {
            res.status(500).json({ error: { message: err }})
          }
      }})
    }
  })
  .catch( err => res.status(500).json(err) )
})

// Check if User UID Exist and STATUS:4:
authRouter.get('/check', getUser, (req,res,next) => {
  const { uid,email } = req
  api.checkOne(email).then( results => {
    if(results.length>0){
      res.status(200).json(results)
    } else {
      res.status(401).json({error: {message: 'No such User'}})
    }
  })
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
