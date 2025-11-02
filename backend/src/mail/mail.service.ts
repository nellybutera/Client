// src/mail/mail.service.ts

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly FRONTEND_LOGIN_URL = "http://localhost:3000/"; // Placeholder URL

  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(
    userEmail: string,
    fullName: string,
    accountNumber: string,
  ) {
    // Mask all but the last 4 digits of the account number
    const maskedAccountNumber = 'XXXX-XXXX-' + accountNumber.slice(-4);

    try {
      await this.mailerService.sendMail({
        to: userEmail,
        subject: 'Welcome to the Finance Platform! Your Account is Ready',
        // You can use an HTML template here, but we'll use a simple text/HTML body for now
        html: `
          <h1>Welcome, ${fullName}!</h1>
          <p>You have successfully registered for our Finance Platform.</p>
          <p>Your new account number is: <strong>${maskedAccountNumber}</strong></p>
          <p>Please log in to start managing your savings and credit.</p>
          <p><a href="${this.FRONTEND_LOGIN_URL}">Click here to Log In</a></p>
          <br>
          <p>Thank you!</p>
        `,
      });
      console.log(`Welcome email successfully sent to ${userEmail}`);
    } catch (error) {
      console.error(`Failed to send welcome email to ${userEmail}:`, error);
      // It's usually best to log the error but not crash the registration process
    }
  }
}