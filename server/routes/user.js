import express from 'express'
import bodyParser from 'body-parser'
//import api from '../api/user'
import api from '../api/user'
import { getUser,getUserId } from '../middleware/'

let userRouter = express({
  mergeParams: true
})

userRouter.use(bodyParser.json())

userRouter.get('/', getUser, (req,res,next) => {
  console.log('userInit(): userRouter.get /user/',req.email)
  const {email} = req
  const scope = ['uid','username','userlast','verified','credit','gender','bday','membership','language','status']
  api.getOne({email},'user',scope)
  .then( response => {
    let user = {}
    const {uid,username,userlast,verified,credit,gender,bday,membership,language,status,...rest} = response[0]
    user = Object.assign({},{uid,username,userlast,verified,credit,gender,bday,membership,language,status})

    if(response.length > 1){
      user.locations =[]
      response.forEach( ent => {
        const {mobile,name,location,city,admin,door,floor,bell,id,entry,prime,c_status} = ent
        if(c_status === 4){ user.locations.push({mobile,name,location,city,admin,door,floor,bell,id,entry,prime}) }
      })
    } else {
      if( rest.id !== null ){
        user.locations =[]
        user.locations.push(rest)
      }
    }
    //console.log(user)
    res.status(200).json({user})
  })
  .catch(err => res.status(500).json({errors: {message:err}}))
})

// GET ALL FACs for All user.locations
userRouter.post('/facs', (req,res,next) => {
  const { ids } = req.body
  api.getAllFac(ids)
  .then( results => {
    let facs = []
    results.forEach( entry => {
      const {fac,city,prime,open,delivery,bottleneck,mobile,...rest} = entry
      //if(open){
        facs = { ...facs, [city]: facs[city]?
          {...facs[city],
            city, prime, open, fac, delivery, bottleneck, mobile,
            products: facs[city].products? [...facs[city].products, rest] : [rest]
          } :
          { city, prime, open, fac, products: [rest]} }

        //facs.push()
      //} else {
      //  facs = { ...facs, [location]: {open: 0}}
      //}
    })
    res.status(200).json(facs)
  })
  .catch( err => console.log(err.message))
})

userRouter.post('/location/:id', (req,res,next) => {
  const {data} = req.body
  console.log('User Router: ',data)
  data.id = Number(req.params.id)
  api.updateOne(data,'user_location')
  .then( () => res.status(200).json({message: 'Location saved!'}))
  .catch( err => res.status(500).json({errors: {message: 'Something went wrong'}}))
})

userRouter.post('/location', getUserId, (req,res,next) => {
  const {data} = req.body
  data.uid = req.uid
  api.saveOne(data,'user_location')
  .then( id => res.status(200).json({id: id}))
  .catch( err => res.status(500).json({errors: {message: 'Something went wrong'}}))
})

export default userRouter
