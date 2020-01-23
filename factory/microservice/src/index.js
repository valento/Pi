import express from 'express'

const mediator = new EventEmitter()

let app = express()

let PORT = process.env.PORT || 8080
let ENV = process.env.ENV || 'development'

app.get('/', (req,res) => {
  const { err } = req
  if( ENV === 'production'){
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
  } else if (!err) {
    res.send('This is just na API')
  } else {
    res.send(err.message)
  }
})

mediator.on('db.ready', db => {
  console.log('DB ready: ',db)
})

mediator.emit('reboot')

app.listen(PORT, () => {
  console.log('API on: ', PORT)
})
