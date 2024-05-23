const mongoose = require("mongoose");
const Joi = require('joi');
const jwt =require("jsonwebtoken")

// User Schema
const UserSchema = new mongoose.Schema({
  Firstname: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  Lastname: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlength: 20,

  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
  },
  nationality: {
    type: String,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  bankAccount: {
    type: String,
    required: true,
    trim: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: Object,
    default: {
      url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
      publicId: null,
    },
  },
  CallID: {
    type: String,
  }
}, {
  timestamps: true,
});


// generate auth token
UserSchema.methods.generateAuthToken=function(){
  return jwt.sign({id:this._id, isAdmin:this.isAdmin},process.env.JWT_SECRET);

}


// User model
const User = mongoose.model('User', UserSchema);


// Validate register user
function validateRegisterUser(obj) {
  const schema = Joi.object({
    Firstname: Joi.string().trim().min(2).max(100).required(),
    Lastname: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().min(5).max(100).required().email(),
    phone: Joi.string().trim().min(6).max(20).required(),
    password: Joi.string().trim().min(8).required(),
    nationality: Joi.string().trim().optional(),
    isAdmin: Joi.boolean().required(),
    address: Joi.string().trim().required(),
    bankAccount: Joi.string().trim().required(),
    birthday: Joi.date().required(),
    projectName: Joi.string().trim().required(),
  });
  return schema.validate(obj);
}

// Validate login user
function validateLoginUser(obj) {
  const schema = Joi.object({

    email: Joi.string().trim().min(5).max(100).required().email(),

    password: Joi.string().trim().min(8).required(),
  });
  return schema.validate(obj);
}


// Validate Update User
function validateUpdateUser(obj) {
  const schema = Joi.object({
    Firstname: Joi.string().trim().min(2).max(100),
    Lastname: Joi.string().trim().min(2).max(100),
    email: Joi.string().trim().min(5).max(100),
    password: Joi.string().trim().min(8),
    isAdmin:Joi.string().trim(),
    phone:Joi.string().trim().min(6),
    address: Joi.string().trim(),
    CallID:Joi.string().trim().min(6),
    
  });
  return schema.validate(obj);
}
module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
};
