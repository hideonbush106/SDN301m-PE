var { body } = require("express-validator");

const courseValidation = [
  body("courseName").notEmpty().withMessage("Course name is required"),
  body("courseDescription")
    .notEmpty()
    .withMessage("Course description is required"),
];

const sectionValidation = [
  body("sectionName")
    .notEmpty()
    .withMessage("Section name is required")
    .matches(/^[A-Z][A-Za-z0-9\s\/&.,]*$/)
    .withMessage("Section name is invalid"),
  body("sectionDescription")
    .notEmpty()
    .withMessage("Section description is required"),
  body("duration").notEmpty().withMessage("Duration is required"),
  body("course").notEmpty().withMessage("Course is required"),
];

module.exports = { courseValidation, sectionValidation };
