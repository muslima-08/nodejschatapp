const router = require('express').Router();

const userCtrl = require('../Controllers/userCtrl');
const { authMiddlaware } = require('../middlewares/authMiddlawers');


router.get('/:id', userCtrl.getUser)
router.get('/', authMiddlaware, userCtrl.getAllUser)
router.put('/:id', authMiddlaware, userCtrl.updateUser)
router.delete('/:id',authMiddlaware, userCtrl.deleteUser)


module.exports = router