import { render } from '@react-email/render'
import { Resend as Client } from 'resend'

import WelcomeEmail from '~/lib/email/templates/welcome-email'

export class Resend {
  private readonly replyTo = 'dr.sarath@fcclinics.com'
  public readonly client: Client

  constructor(opts: { apiKey: string }) {
    this.client = new Client(opts.apiKey)
  }

  public async sendWelcomeEmail(req: { email: string }): Promise<void> {
    const html = render(<WelcomeEmail />)

    await this.client.emails.send({
      from: 'FC Clinics <dr.sarath@fcclinics.com>',
      html,
      reply_to: this.replyTo,
      subject: 'Welcome to FC Clinics!',
      to: req.email,
    })
  }
}
