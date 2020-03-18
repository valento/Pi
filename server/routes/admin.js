import express from 'express'
import bodyParser from 'body-parser'
import requestLanguage from 'express-request-language'
import { getLan } from '../middleware/'
import api from '../api/'
import uniqid from 'uniqid'

let adminRouter = express.Router({
  mergeParams: true
})

adminRouter.use(bodyParser.json())

adminRouter.get('/location/ref/:uid', requestLanguage({
  languages: ['en','es']
}), getLan, (req,res,next) => {
  console.log('Get location in: ',req.lan)
  console.log('Get user location by: ',uid)
  const {uid} = req.params
  let data
  api.getOneReference({uid},'location')
  .then( response => {
    const { name,id,number } = response[0]
    let street = JSON.parse(name)[req.lan]
    if(isNaN(uid)){
      data = Object.assign({},{number},{id},{street})
    } else {
      data = Object.assign({},{number},{street})
    }
    res.status(200).json(data)
  })
  .catch(err => { res.status(500).json({messages: 'Wrong...'}) })
})

adminRouter.get('/location/:type/:by', requestLanguage({
  languages: ['en','es']
}), getLan, (req,res,next) => {
  let scope = ['*']
  let params = {}, data = {}, tp='', prs=false, r=[]
  let { type,by } = req.params
  switch(req.params.type) {
    case 'street':
      params.city= Number(req.params.by)
      tp = 'streets'
      prs = true
    break
    case 'location':
      tp = 'locations'
      params.street_id= Number(req.params.by)
    break
    default: params.city = Number(req.params.by)
  }

  api.getList(type,scope,params).then( response => {
    if (prs) {
      r = response.map( entry => {
        return {title: JSON.parse(entry.name)[req.lan], id: entry.id}//req.language
      })
    } else {
      r = response.map( entry => {
// if location type is basic:
        if(entry.type===32){return {title: entry.number, id: entry.id}}
      })
    }
    data[tp] = r
    res.status(200).json(data)
  })
  .catch( err => res.status(500).json({messages: 'Something went wrong!'}))
})

adminRouter.get('/location', requestLanguage({
  languages: ['en','es']
}), getLan, (req,res,next) => {
  let data = {},
      params = {}
      //lan = req.language==='es'? 'es' : 'bg'
      if(req.lan) {
        const {lan} = req
      } else {
        let lan = req.language==='es'? 'es' : 'bg'
      }
  params.c_status = 4
  api.getList('city',['id','name'],params).then( response => {
    const cty = response.map( entry => {
      return {title: JSON.parse(entry.name)[lan], id: entry.id}//req.language
    })
    data.city = cty
    res.status(200).json(data)
  })
})

// MAKE a LOCATION (a building): Street_ID, City_ID, Number
adminRouter.post('/location/:type', (req,res,next) => {
  const { data } = req.body
  const { type } = req.params
  let msgCap = type.charAt(0).toUpperCase() + type.slice(1)
  console.log(msgCap + ' Save: ',data,type)
  if (type === 'location') {
    data.uid = uniqid.time()
  }
  api.saveOneLocation(data,type)
  .then(res.status(200).json({message: `${msgCap} Saved!`}))
  .catch( err => console.log('Error',err))
})

//adminRouter.post('/locations/loc')

export default adminRouter

// SZ, HD, lat:42.430320, lng:25.622825
