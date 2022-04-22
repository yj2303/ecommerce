const { Router} =  require('express');
const router = Router();

const { createUser, deleteUser, updateUser,login } = require('../controllers/user.controller');

const {validate}= require('../authenticate');

// router.get('/',getUsers);
// router.get('/:id',getUserById);
router.post('/',createUser);
router.delete('/:id',validate, deleteUser);
router.put('/:id',validate, updateUser);
router.post("/login", login);

module.exports = router;