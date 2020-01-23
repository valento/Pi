import express from 'express'
import bodyParser from 'body-parser'
import { getLan,getUserId } from '../middleware/'
import api from '../api/'

let orderRouter = express.Router({
  mergeParams: true
})

orderRouter.use(bodyParser.json())

orderRouter.post('/', getUserId, (req,res,next) => {
  const {uid} = req
  console.log(uid)
  console.log(req.body)
  res.status(200).json({message: 'Order recieved'})
})

export default orderRouter
