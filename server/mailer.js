import mailer from 'nodemailer'
import smtp from 'nodemailer-smtp-transport'
import dotenv from 'dotenv'

dotenv.config({silent: true})

let HOST

if(process.env.NODE_ENV==='production'){
  HOST=process.env.HOST
} else {
  HOST='http://localhost:8080'
}

const from = `'PiLab' <noreply@lightcharm.co>`

const setup = () => {
  return mailer.createTransport(
    //smtp(
      {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.MAILJET_API_KEY,
          pass: process.env.MAILJET_API_SECRET,
        }
      }
    //)
  )
}

export const sendConfirmMail = (email,token) => {
  const transport = setup()
  const mail = {
    from,
    to: email,
    subject: 'Wellcome to Pi-Lab: the best pizza in town',
    text: `Wellcome Pi,\n\nplease click the link to confirm your email...
    \n\n
      ${HOST}/auth/confirmation/${token}
    `
  }
  console.log(`${HOST}/confirmation/${token}`)
  transport.sendMail(mail, (err,json)=>{
    if(err){
      return console.log(err)
    }
    console.log(json)
  })
}

/* =============================================== */
