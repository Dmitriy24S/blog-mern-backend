import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'

export const register = async (req, res) => {
  try {
    console.log('req.body:', req.body)

    // (refactored into separate middleware):
    // const errors = validationResult(req); // ?
    // if not empty -> there are errors
    // if (!errors.isEmpty()) {
    //   return res.status(400).json(errors.array());
    // }
    //   [
    // 	{
    // 		"msg": "Invalid value",
    // 		"param": "passowwrd",
    // 		"location": "body"
    // 	},
    // 	{
    // 		"value": "",
    // 		"msg": "Invalid value",
    // 		"param": "avatarUrl",
    // 		"location": "body"
    // 	}
    // ^ (refactored into separate middleware)

    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt) // enrypt password

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      // password: req.body.password,
      // passwordHash: req.body.password,
      passwordHash: hash
    })

    // create in mongoDB
    const user = await doc.save()

    // encrypt password? / new token?
    const token = jwt.sign(
      {
        _id: user._id
      },
      'secret123',
      {
        expiresIn: '30d'
      }
    )

    // prevent password return
    const { passwordHash, ...userData } = user._doc

    // if all ok:
    res.json({
      token,
      success: true,
      ...userData
    })
    // {
    //     "success": true,
    //     "user": {
    //         "fullName": "Vasya Pupkinz",
    //         "email": "testz@test.com",
    //         "passwordHash": "$2b$10$7IBt.CkAuxNv2xhlH2GBw.YkI6e1UWGTpq6kamAcWe7fVh9ZoI436",
    //         "avatarUrl": "https://www.resetera.com/forums/etcetera-forum.9/z",
    //         "_id": "633b0c5b2d83b39bc3adc91c",
    //         "createdAt": "2022-10-03T16:22:51.553Z",
    //         "updatedAt": "2022-10-03T16:22:51.553Z",
    //         "__v": 0
    //     }
    // }
  } catch (error) {
    console.log(error)
    res.status(500).json([
      {
        // test: {
        // message: 'Unable to register',
        msg: 'Unable to register',
        error
        // }
      }
    ])
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email })

    if (!user) {
      // if not in DB return error & add 'return' to stop future code
      return res.status(404).json({
        // message: 'User not found'
        msg: 'User not found'
      })
    }

    // compare password?
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash)

    if (!isValidPass) {
      // if not valid password:
      return res.status(404).json({
        // message: 'Incorrect login or password'
        msg: 'Incorrect login or password'
      })
    }

    // encrypt password? / new token?
    const token = jwt.sign(
      {
        _id: user._id
      },
      'secret123',
      {
        expiresIn: '30d'
      }
    )

    // prevent password return
    const { passwordHash, ...userData } = user._doc

    // if all ok:
    res.json({
      token,
      ...userData
    })
    // {
    // 	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzNiMjE0NGFkMjYzNTY4ZWUwZmZmNjkiLCJpYXQiOjE2NjQ4MjAyMTcsImV4cCI6MTY2NzQxMjIxN30.hSMVyzQubEWIj_PNKoAuBeVgnICHfUo_buKgSAzfKQo",
    // 	"_id": "633b2144ad263568ee0fff69",
    // 	"fullName": "Vasya Pupkinz",
    // 	"email": "testz2@test.com",
    // 	"avatarUrl": "https://www.resetera.com/forums/etcetera-forum.9/z",
    // 	"createdAt": "2022-10-03T17:52:04.346Z",
    // 	"updatedAt": "2022-10-03T17:52:04.346Z",
    // 	"__v": 0
    // }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      // message: 'Unable to login'
      msg: 'Unable to login'
    })
  }
}

export const getMe = async (req, res) => {
  try {
    // after success middleware checkAuth & decoded id
    const user = await UserModel.findById(req.userId)

    if (!user) {
      // if user not found
      return res.status(404).json({
        message: 'User not found'
      })
    }

    // prevent return passowrd
    const { passwordHash, ...userData } = user._doc

    // if all ok:
    res.json({
      success: true,
      user,
      ...userData
    })
    //   {
    // 	"success": true,
    // 	"user": {
    // 		"_id": "633b2144ad263568ee0fff69",
    // 		"fullName": "Vasya Pupkinz",
    // 		"email": "testz2@test.com",
    // 		"passwordHash": "$2b$10$p5tziVTN2uleAQVDWlkbfehGenWZ4Ua.dP3wDuZ1A4H5FNrlR80.G",
    // 		"avatarUrl": "https://www.resetera.com/forums/etcetera-forum.9/z",
    // 		"createdAt": "2022-10-03T17:52:04.346Z",
    // 		"updatedAt": "2022-10-03T17:52:04.346Z",
    // 		"__v": 0
    // 	},
    // 	"_id": "633b2144ad263568ee0fff69",
    // 	"fullName": "Vasya Pupkinz",
    // 	"email": "testz2@test.com",
    // 	"avatarUrl": "https://www.resetera.com/forums/etcetera-forum.9/z",
    // 	"createdAt": "2022-10-03T17:52:04.346Z",
    // 	"updatedAt": "2022-10-03T17:52:04.346Z",
    // 	"__v": 0
    // }
  } catch (error) {
    res.status(500).json({
      message: 'Unable to get user'
    })
  }
}
