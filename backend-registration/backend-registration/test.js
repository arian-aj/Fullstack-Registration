import { Resend } from 'resend';

const resend = new Resend('re_8w5qW2uA_96iwrqYQfQrmmZgcBGsf6QMA');

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'arian.ansari@dci-student.org',
  subject: 'Hello World 1',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
});

// import crypto from "node:crypto";

// const token = crypto.randomBytes(32).toString("hex");

// console.log(token)

// Der Token expired nach einem Tag
// const expirationDate = Date.now() + 1000 * 60 * 60 * 24



// console.log(expirationDate)