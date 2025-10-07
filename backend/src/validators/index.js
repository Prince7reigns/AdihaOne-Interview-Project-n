import { body, validationResult } from "express-validator";

const userRegisterValidator = () =>{
     return [
        body("email")
             .trim()
             .notEmpty()
             .withMessage("Email is required")
             .isEmail()
             .withMessage("Email is invalid"),
        body("username")
             .trim()
             .notEmpty()
             .withMessage("username is required")
             .isLowercase()
             .withMessage("username need to be lowercase")
             .isLength({min:3})
             .withMessage("Username must be at least 3 char"),
        body("password")
            .trim()
             .notEmpty()
             .withMessage("password is required")
             .isLength({min:6})
             .withMessage("Username must be at least 3 char"),
        body("fullName")
           .trim()
           .optional()
     ]
}

const userLoginValidator = () =>{
     return [
          body("email")
            .isEmail()
            .optional()
            .withMessage("email is invalid"),
          body("password")
            .isEmpty()
            .withMessage("password is required")
     ]
}

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword")
    .notEmpty()
    .withMessage("Old password is required")
    .isLength({min:6})
     .withMessage("Username must be at least 3 char"),,
    body("newPassword").notEmpty().withMessage("New password is required")
    .isLength({min:6})
    .withMessage("Username must be at least 3 char"),,
  ];
};

const taskCreateValidator = () => [
  body("title")
    .notEmpty().withMessage("Title is required")
    .isString().withMessage("Title must be a string")
    .isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),

  body("description")
    .optional()
    .isString().withMessage("Description must be a string")
    .isLength({ max: 500 }).withMessage("Description can’t exceed 500 characters"),

  body("priority")
    .notEmpty().withMessage("Priority is required")
    .isIn(["low", "medium", "high"]).withMessage("Priority must be low, medium, or high"),

  body("dueDate")
    .optional()
    .isISO8601().withMessage("Deadline must be a valid date in ISO8601 format (YYYY-MM-DD)")
];


export {
    userRegisterValidator,
    userLoginValidator,
    userChangeCurrentPasswordValidator,
    taskCreateValidator
}