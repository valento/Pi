import express from 'express'
import bodyParser from 'body-parser'
import requestLanguage from 'express-request-language'
import api from '../api/'

let productRouter = express.Router({
  mergeParams: true
})

productRouter.use(bodyParser.json())

productRouter.get('/:lan', (req,res,next) => {
  let {lan} = req.params
// get only commercial products {type:1}:
  api.getList('product',['*'],{type:1})
  .then( response => {
    let products = []
    response.forEach( entry => {
      if(entry.c_status===4){
        const { id,promo,price,price_pos,list,category,klass,prod_time } = entry
        products.push({name: JSON.parse(entry.name)[lan], dscr: JSON.parse(entry.descr)[lan],...{id,promo,price,list,category,klass}})
      }
    })
    res.status(200).json(products)
  })
  .catch(err => { res.status(500).json({messages: 'Wrong...'}) })
})

export default productRouter
