import express from "express";
import User from "./models/User.js";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { error } from "node:console";
import { Resend } from "resend";
await mongoose.connect("mongodb://127.0.0.1:27017/myDB");

const app = express();
const resend = new Resend("re_8w5qW2uA_96iwrqYQfQrmmZgcBGsf6QMA")
app.use(express.json());

app.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({error: 'Invalid registration'});
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const tokenExpiresAt = Date.now() + 1000 * 60 * 60 * 24

  const user = await User.create({
    email: email,
    password: hashedPassword,
    verificationToken: verificationToken,
    tokenExpiresAt: tokenExpiresAt
  })

  res.status(201).json(user);
})

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({error: 'Invalid login'});
  }

  try {
    // TODO: checke erst ob Email korrekt
  const user = await User.findOne({email: email});
  if (!user) {
    return res.status(401).json({error: 'Invalid login'});
  }

  // checke ob verified ist
  const verified = user.verified;
  if (verified === false) {
    return res.status(403).json({error: "Account not verified"})
  }
  const passwordCorrect = await bcrypt.compare(password, user.password);

  if (!passwordCorrect) {
    return res.status(401).json({error: 'Invalid login'});
  }

  res.json({status: "success", user: user});
  }
  catch (error) {
    res.status(500).json({error: error.message})
  }
})

app.get("/verify/:token", async (req, res) => {
  // hole Token aus URL
  const token = req.params.token
  // überprüfe ob Token in der users collection existiert
  const user = await User.findOne({verificationToken: token});

  // checke ob user gefunden wurde und ob token noch gültig
  if (user && Date.now() < user.tokenExpiresAt) {
    // verified true setzen
    user.verified = true;
    // entferne die anderen Felder (nur benötigt wenn nicht verified)

    // speichere verändertes Objekt
    await user.save();
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: user.email,
      subject: "Verification",
      html: `
      <h3 style="color: lightgreen">Welcome to d01b!</h3>
      <p>Wir freuen uns, dich in unserem Team zu haben</p>
      <p>Bitte bestätige deine E-Mail</p>
      <a href="http://localhost:3000/verify/${user.verificationToken}">E-Mail bestätigen</a>
      <p>Nächste Schritte:</p>
      <ol>
        <li>Explore our features</li>
        <li>Set up your profile</li>
        <li>Start using our platform to maximize productivity</li>
      </ol>
      <p>Bis bald!</p>
      <p>Das d01b</p>
      `,
    });
    user.verificationToken = undefined;
    user.tokenExpiresAt = undefined;
    if (error) {
      return res.status(500).json({ error });
    }
    return res.json({"message": "Your account has been succesfully verified", "data": data})
  } else {
    res.status(400).json({"error": "invalid or expired token, Please request a new one"})
  }
})


app.listen("3000", () => console.log("server started on port 3000"));