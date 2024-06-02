const router=require("express").Router();
const { getAllUserCtrl, getUserProfileCtrl, updateUserProfileCtrl, profilePhotoUploadCtrl, getUsersCountCtrl, deleteUserProfileCtrl } = require("../controllers/usersController");
const { verifyToken, verifyAdminToken} = require("../middlewares/verifyToken");
const validateObjectId =require("../middlewares/validateObjectId");
const photoUpload = require("../middlewares/photoUpload");


// /api/users/profile
router.route("/profile").get( verifyToken,getAllUserCtrl);



// /api/users/profile/:id
router.route("/profile/:id")
    .get(validateObjectId, getUserProfileCtrl)
//    .put(validateObjectId,verifyToken,,updateUserProfileCtrl)

    .delete(validateObjectId,verifyToken,deleteUserProfileCtrl);


// /api/users/profile-photo-upload
router.route("/profile/profile-photo-upload")
    .post( verifyToken,photoUpload.single("image"),profilePhotoUploadCtrl);

// /api/users/count
router.route("/count").get( verifyAdminToken,getUsersCountCtrl);

module.exports = router;
