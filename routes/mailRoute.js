const router=require("express").Router();
const {sendJoinCodeByEmail }= require('../controllers/mailController');
const {verifyToken} = require('../middlewares/verifyToken');
router.post("/",verifyToken,sendJoinCodeByEmail)







module.exports = router;
