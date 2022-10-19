import { validationResult } from "express-validator";

// middleware - handleValidationErrors
export default (req, res, next) => {
  // if error -> stop future actions
  const errors = validationResult(req); // ?
  // if not empty -> there are errors -> stop future actions -> return with error
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  }
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

  // if no errors -> continue
  next();
};
