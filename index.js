import cors from 'cors'
import express from 'express'
import fs from 'fs'
import mongoose from 'mongoose'
import multer from 'multer'

import { PostController, UserController } from './constrollers/index.js'
import { checkAuth, handleValidationErrors } from './utils/index.js'
import { loginValidation, postCreateValidation, registerValidation } from './validations.js'

// process.env.MONGO_URI
// .connect(
//   'mongodb+srv://admin:12345q@cluster0.mkqqtge.mongodb.net/blog?retryWrites=true&w=majority'
// )
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('DB - OK')
  })
  .catch((error) => console.log('DB - ERROR', error))

const app = express()
app.use(express.json())
app.use(cors())
// app.options('*', cors())
// app.enableCors({
//   origin: true,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//   credentials: true
// })

app.get('/', (req, res) => {
  res.send('Hello World!') // Browser displays info
})

// Image upload handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // if no uploads folder -> make uploads folder
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads')
    }
    cb(null, './uploads')
    // save to folder -> uploads
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
    // file name
  }
})

const upload = multer({ storage })

app.use('/uploads', express.static('uploads')) // express check if receive request for upload -> check if already have in folder -> if yes? show it in browser

// Image upload
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    // return to client which address saved image (req.file = from middleware access image)
    url: `uploads/${req.file.originalname}`
  })
})

// User
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.get('/auth/me', checkAuth, UserController.getMe)

// Posts
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
)
app.delete('/posts/:id', checkAuth, PostController.remove)

// Launch server
// process.env.PORT || 4444
// app.listen(4444, (error) => {
app.listen(process.env.PORT || 4444, (error) => {
  if (error) {
    return console.log(error)
  }
  console.log('Server OK')
})
