import express from 'express'
import bodyParser from 'body-parser'
//import api from '../api/user'
import api from '../api/user'
import { getUser,getUserId,getLan } from '../middleware/'

let userRouter = express({
  mergeParams: true
})

userRouter.use(bodyParser.json())

// get user data: location, user
userRouter.get('/', getUser, (req,res,next) => {
  const { email } = req
  //let usr = {}
    console.log('userInit(): userRouter.get /user/',req.email)
  const scope = [
    'uid','username','userlast','verified','orders','credit',
    'gender','bday','membership','language','status'
  ]
  api.getOne({ email },'user',scope)
  .then( response => {
    if(response.length === 0) return res.status(401).json({error: {message: 'User Not Found'}})

    let user = {}
    const {
      uid,username,userlast,verified,orders,credit,
      gender,bday,membership,language,status,...rest
    } = response[0]
    let free_pizza = orders%5===0
    user = Object.assign({},{
      uid,username,userlast,verified,orders,credit,
      gender,bday,membership,language,status
    },{free_pizza: free_pizza})

    if(response.length > 1){
      user.locations =[]
      response.forEach( ent => {
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
    //console.log(user)
    res.status(200).json({user})
  })
  .catch(err => res.status(500).json({ error: { message: err }}))
})
// UPDATE FAC: state
userRouter.post('/fac/:id', (req,res,next) => {
  const { data } = req.body
  data.id = Number(req.params.id)
  api.updateOne(data,'fac')
  .then( () => {
    res.status(200).json({})
  })
  .catch( err => res.status(500).json({ error: { message: err }}))
})


// GET FAC for users location
userRouter.post('/facs', getLan, (req,res,next) => {
  const { lan } = req
  const { id } = req.body
  api.getFac(id)
  .then( results => {
    let facs = {}
    const {id,city,name,street,number,prime,open,
      sat_open,sat_close,sun_open,
      sun_close,vacation_end,vacation_start,
      delivery,bottleneck,mobile} = results[0]
    const st = JSON.parse(street)[lan]
    let products = results.map( entry => {
      const {product,local_promo,local_price,on_hand,take_only,add_time} = entry
      return {product,local_promo,local_price,on_hand,take_only,add_time}
      //if(open){
        //facs = { ...facs, [city]: facs[city]?
        //  {...facs[city],
        //    city, prime, open, fac, delivery, bottleneck, mobile,
        //    products: facs[city].products? [...facs[city].products, rest] : [rest]
        //  } :
        //  { city, prime, open, fac, products: [rest]} }
        //facs.push()
      //} else {
      //  facs = { ...facs, [location]: {open: 0}}
      //}
    })
    facs = Object.assign({id,city,name,number,prime,open,
      sat_open,sat_close,sun_open,checkin,
      sun_close,vacation_end,vacation_start,
      delivery,bottleneck,mobile},{products:products},{street: st})
    res.status(200).json(facs)
  })
  .catch( err => console.log(err.message))
})

// update users location: location details
userRouter.post('/location/:id', (req,res,next) => {
  const { data } = req.body
  console.log('User Router: ',data)
  data.id = Number(req.params.id)
  api.updateOne(data,'user_location')
  .then( () => res.status(200).json({message: 'Location saved!'}))
  .catch( err => res.status(500).json({errors: {message: 'Something went wrong'}}))
})

// insert new user location
userRouter.post('/location', getUser, (req,res,next) => {// or getUserId
  const {data} = req.body
  data.uid = req.uid
  api.saveOne(data,'user_location')
  .then( id => res.status(200).json({id: id}))
  .catch( err => res.status(500).json({errors: {message: 'Something went wrong'}}))
})

export default userRouter
