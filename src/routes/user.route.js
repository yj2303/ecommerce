const { Router} =  require('express');
const router = Router();

const { getUsers, createUser, getUserById, deleteUser, updateUser,login } = require('../controllers/user.controller');
router.get('/',getUsers);
router.get('/:id',getUserById);
router.post('/',createUser);
router.delete('/:id',deleteUser);
router.put('/:id',updateUser);
router.post("/login", login);

module.exports = router;