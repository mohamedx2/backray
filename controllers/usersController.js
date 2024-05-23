const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/user");
const path =require ("path");
const {cloudinaryRemoveImage,cloudinaryUploadImage}=require("../utils/cloudinary")
const fs=require('fs');



/*-----------------------------------------------------------
### tafsir ###
*@desc       get All users profile
*@router     /api/users/profile
*@method     GET
*@access     private (only admin)
---------------------------------------------------------------*/

module.exports.getAllUserCtrl=asyncHandler (async (req,res)=>{
  const users = await User.find().select("-password");
  
  res.status(200).json(users)
})



/*-----------------------------------------------------------
### tafsir ###
*@desc       get  user profile
*@router     /api/users/profile/:id
*@method     GET
*@access     private (only admin)
---------------------------------------------------------------*/

module.exports.getUserProfileCtrl=asyncHandler (async (req,res)=>{
  const user = await User.findById(req.params.id).select("-password");
  if (!user){
    return res.status(404).json({message : "user not found"});
  }
  
  res.status(200).json(user)
})


/*-----------------------------------------------------------
### tafsir ###
*@desc       Update user profile
*@router     /api/users/profile/:id
*@method     GET
*@access     private (only user)
---------------------------------------------------------------*/

module.exports.updateUserProfileCtrl = asyncHandler(async (req, res) => {
  // Validate request body
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Hash the password if included in the request body
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          Firstname: req.body.Firstname,
          Lastname: req.body.Lastname,
        //  password: req.body.password.bcrypt, // Update password if provided
          phone: req.body.phone,
          isAdmin: req.body.isAdmin,
          address: req.body.address,
          CallID:req.body.CallID,
        },
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });

  }
});


/*-----------------------------------------------------------
### tafsir ###
*@desc       get  users count
*@router     /api/users/Count
*@method     GET
*@access     private (only admin)
---------------------------------------------------------------*/

module.exports.getUsersCountCtrl=asyncHandler (async (req,res)=>{
  const user = await User.countDocuments();
    res.status(200).json(user);
  
  
  res.status(200).json(user)
});





/*-----------------------------------------------------------
### tafsir ###
*@desc       Profile Photo Upload
*@router     /api/users/profile/profile-photo-upload
*@method     POST
*@access     private (only logged in user)
---------------------------------------------------------------*/



module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  // 1. Validation
  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }

  // 2. Get the path to image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  // 3. Upload to cloudinary
  try {
    const result = await cloudinaryUploadImage(imagePath);

    // 4. Get the user from DB
    const user = await User.findById(req.user.id);

    // 5. Delete the old photo if exists
    if (user.profilePhoto.publicId !== null) {
      await cloudinaryRemoveImage(user.profilePhoto.publicId);
    }

    // 6. Change the photo field in DB
    user.profilePhoto = {
      url: result.secure_url,
      publicId: result.public_id,
    };
    await user.save();

    // 7. Send response to client
    res.status(200).json({
      message: "Your photo uploaded successfully",
      profilePhoto: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });

    // 8. Remove image from the server
    fs.unlinkSync(imagePath);

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return res.status(500).json({ message: 'Error uploading image' });
  }
});



/*-----------------------------------------------------------
### tafsir ###
*@desc       delete user Profile 
*@router     /api/users/profile/:id
*@method     DELETE
*@access     private (only admin or user )
---------------------------------------------------------------*/


module.exports.deleteUserProfileCtrl = asyncHandler(async (req, res) => {
  // 1. Get user from db
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 2. Delete photos from cloudinary
   cloudinaryRemoveImage(user.profilePhoto.publicId);

  // 3. Simulate delay before deleting the user (0 seconds delay)
  setTimeout(async () => {
    await User.findByIdAndDelete(req.params.id);

    // 4. Send a delayed response to the user
    res.status(200).json({ message: "User deleted successfully" });
  },1 ); // 5000 milliseconds (5 seconds) delay
});