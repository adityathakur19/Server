// controllers/userController.js
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/userModel');

const userController = {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;
      const userExists = await User.findOne({ $or: [{ email }, { username }] });
      
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = await User.create({
        username,
        email,
        password
      });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      });

      res.status(201).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      });

      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

    async forgotPassword(req, res) {
      try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = Date.now() + 600000; // 10 minutes
  
        user.resetPasswordToken = otp;
        user.resetPasswordExpire = otpExpiry;
        await user.save();
  
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
          }
        });
  
        const mailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: user.email,
          subject: 'Password Reset OTP',
          html: `
            <h1>Password Reset OTP</h1>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>This OTP is valid for 10 minutes</p>
          `
        };
  
        await transporter.sendMail(mailOptions);
        res.json({ message: 'OTP sent to email' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  
    async verifyOTP(req, res) {
      try {
        const { email, otp } = req.body;
        console.log('Search criteria:', { email, resetPasswordToken: otp });
        
        const user = await User.findOne({ email });
        console.log('User found:', user);
    
        if (!user || user.resetPasswordToken !== otp || user.resetPasswordExpire < Date.now()) {
          return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
    
        res.json({ message: 'OTP verified', email });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    },
  
    async resetPassword(req, res) {
      try {
        const { email, password, otp } = req.body;
        const user = await User.findOne({
          email,
          resetPasswordToken: otp,
          resetPasswordExpire: { $gt: Date.now() }
        });
  
        if (!user) {
          return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
  
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
  
        res.json({ message: 'Password reset successful' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  };
  
  module.exports = userController;