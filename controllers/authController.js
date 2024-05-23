const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateRegisterUser,validateLoginUser } = require("../models/user");








/*-----------------------------------------------------------
### tafsir ##
*@desc       register New user 
*@router     /api/auth/register
*@method     POST
*@access     public
---------------------------------------------------------------*/

module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  // Validation
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
      
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a new user object
    
    user = new User({
      Firstname: req.body.Firstname,
      Lastname: req.body.Lastname,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword,
      nationality: req.body.nationality,
      isAdmin: req.body.isAdmin,
      address: req.body.address,
      bankAccount: req.body.bankAccount,
      birthday: req.body.birthday,
      projectName: req.body.projectName,
    });

    // Save the user to the database
    await user.save();

    // @todo- sending email (verify account) 

    // Send a response to the client
    res.status(201).json({ message: 'Acount registered successfully. Please log in to your account.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Number already exists' });
  }
});







/*-----------------------------------------------------------
### tafsir ###
*@desc       Login user 
*@router     /api/auth/login 
*@method     POST
*@access     public
---------------------------------------------------------------*/

module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
  try {
    //validation 
    const { error } = validateLoginUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    //user exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    //check the password
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    //generate token (jwt)
    const token = user.generateAuthToken();

    //response to client 
    res.status(200).json({
      _id: user._id,
      Firstname: user.Firstname,
      Lastname: user.Lastname,
      email: user.email,
      phone: user.phone,
      password: user.password,
      nationality: user.nationality,
      isAdmin: user.isAdmin,
      address: user.address,
      bankAccount: user.bankAccount,
      birthday: user.birthday,
      profilePhoto: user.profilePhoto,
      projectName: user.projectName,
      token,
      
    })
  } catch (err) {
    //handle unexpected errors
    console.error(err);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
})
