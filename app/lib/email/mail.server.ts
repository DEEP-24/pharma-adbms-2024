// nodemailer

import { render } from '@react-email/render'
import * as nodemailer from 'nodemailer'

import WelcomeEmail from '~/lib/email/templates/welcome-email'

export enum EmailTemplate {
  WELCOME_EMAIL = 'welcome-email',
}
type SendMailOptions = {
  to: Required<nodemailer.SendMailOptions['to']>
} & {
  template: EmailTemplate.WELCOME_EMAIL
  templateProps: {
    name: string
  }
}

async function sendMail(props: SendMailOptions) {
  // const testAccount = await nodemailer.createTestAccount()

  const transporter = nodemailer.createTransport({
    // secure: true, // true for 465, false for other ports
    auth: {
      pass: 'Sarath@123', // generated ethereal password
      user: 'dr.sarath@fcclinics.com', // generated ethereal user
    },
    host: 'smtpout.secureserver.net',
    port: 587,
  })

  const info = await transporter.sendMail({
    from: 'FC Clinics <dr.sarath@fcclinics.com>', // sender address
    html: render(WelcomeEmail()),
    subject: 'Welcome to FC Clinics!',
    text: render(WelcomeEmail(), {
      plainText: true,
    }),
    to: props.to,
  })

  console.log('Message sent: %s', info.messageId)
  console.log(info)

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}

export { sendMail }
