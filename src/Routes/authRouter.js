const router = require('express').Router();


const authCtrl = require('../Controllers/authCtrl');

router.post("/signup", authCtrl.singUp );
router.post("/login", authCtrl.signIn );


module.exports = router;
