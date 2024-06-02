const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateRegisterUser, validateLoginUser } = require("../models/user");
const Join = require("../models/join");

/*-----------------------------------------------------------
### tafsir ##
*@desc       Register new user 
*@router     /api/auth/register
*@method     POST
*@access     public
---------------------------------------------------------------*/

module.exports.registerUserCtrl = asyncHandler(async (req, res) => {
  try {
    // Check for valid join code
    const join = await Join.findOne({ key: req.body.joinCode });
    if (!join) {
      return res.status(400).json({ message: "Invalid join code" });
    }

    // Exclude joinCode from validation
    const { joinCode, ...userData } = req.body;

    // Validate user data
    const { error } = validateRegisterUser(userData);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

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

    // Remove the join code after use
    await Join.deleteOne({ _id: join._id });

    // @todo- sending email (verify account) 

    // Send a response to the client
    res.status(201).json({ message: 'Account registered successfully. Please log in to your account.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An unexpected error occurred' });
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
    // Validation
    const { error } = validateLoginUser(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check the password
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token (jwt)
    const token = user.generateAuthToken();

    // Respond to client
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
    });
  } catch (err) {
    // Handle unexpected errors
    console.error(err);
    res.status(500).json({ message: "An unexpected error occurred" });
  }
});
