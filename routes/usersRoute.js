const router=require("express").Router();
const { getAllUserCtrl, getUserProfileCtrl, updateUserProfileCtrl, profilePhotoUploadCtrl, getUsersCountCtrl, deleteUserProfileCtrl } = require("../controllers/usersController");
const {verifyTokenAndAdmin, verifyTokenAndOnlyUser, verifyToken, verifyTokenAndAuthorization, verifyTokenAdminUser} = require("../middlewares/verifyToken");
const validateObjectId =require("../middlewares/validateObjectId");
const photoUpload = require("../middlewares/photoUpload");


// /api/users/profile
router.route("/profile").get( verifyTokenAndAdmin,getAllUserCtrl);



// /api/users/profile/:id
router.route("/profile/:id")
    .get(validateObjectId, getUserProfileCtrl)
//    .put(validateObjectId,verifyTokenAndOnlyUser,,updateUserProfileCtrl)
    .put(validateObjectId,verifyTokenAdminUser,updateUserProfileCtrl)
    .delete(validateObjectId,verifyTokenAndAuthorization,deleteUserProfileCtrl);


// /api/users/profile-photo-upload
router.route("/profile/profile-photo-upload")
    .post( verifyToken,photoUpload.single("image"),profilePhotoUploadCtrl);

// /api/users/count
router.route("/count").get( verifyTokenAndAdmin,getUsersCountCtrl);

module.exports = router;