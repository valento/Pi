import express from 'express'
import bodyParser from 'body-parser'
import { getLan,getUserId } from '../middleware/'
import api from '../api/'

let orderRouter = express.Router({
  mergeParams: true
})

orderRouter.use(bodyParser.json())

orderRouter.post('/', getUserId, (req,res,next) => {
  const {uid,member} = req
  let order
// If Tester, don't INSERT in DB
  if(member===64) return res.status(200).json({message: 'Order recieved'})

// Prepare SQL Data Object:
  const {user_location,delivery,fac_id,total,cart} = req.body.data
  //console.log(uid, req.body.data)
  api.saveOne(Object.assign({},{uid},{user_location,delivery,total,fac_id}),'orders')
  .then( id => {
    order = id
    let details = cart.map( o => {
      return {order_id: id, item: o.product, quant: o.quant}
    })
    api.saveMany(details,'order_detail')
  })
  .then( () => api.updateOne({id: uid, orders:'orders+1'},'user') )
  .then( () => {
    //req.mediator.emit('new.incoming.order')
    res.status(200).json({message: `Order #${order} recieved`})
  } )
  .catch( err => res.status(500).json({message: err}) )
})

orderRouter.get('/:fac', (req,res,next) => {
  // Get Pending Orders:
})

export default orderRouter
