import { body } from 'express-validator'

export const registerValidation = [
  body('email', 'Wrong email format').isEmail(),
  body('password', 'Password must be at least 5 symbols').isLength({ min: 5 }),
  body('fullName', 'Name is required').isLength({ min: 3 }),
  body('avatarUrl', 'Incorrect avatar url').optional().isURL() // ? isString? / isUrl?
]

export const loginValidation = [
  body('email', 'Wrong email format').isEmail(),
  body('password', 'Password must be at least 5 symbols').isLength({ min: 5 })
]

export const postCreateValidation = [
  body('title', 'Enter title text').isLength({ min: 3 }).isString(),
  body('body', 'Enter body text').isLength({ min: 3 }).isString(),
  // body("tags", "Incorrect tag format").optional().isString(),
  body('tags', 'Incorrect tag format').optional().isArray(),
  body('imageUrl', 'Incorrect image url').optional().isString() // ? isString? / isUrl?
]
