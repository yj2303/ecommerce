const { Router} =  require('express');
const router = Router();


const { getUsers, createUser, getUserById, deleteUser, updateUser } = require('../controllers/index.controller');

const { getProducts, createProduct, getProductById, deleteProduct, updateProduct } = require('../controllers/index.controller');
const { getOrder, createOrder, getOrderById, deleteOrder, updateOrder } = require('../controllers/index.controller');

router.get('/users',getUsers);
router.get('/users/:id',getUserById);
router.post('/users',createUser);
router.delete('/users/:id',deleteUser);
router.put('/users/:id',updateUser);

router.post("/user/login", login);
router.get('/products',getProducts);
router.get('/products/:id',getProductById);
router.post('/products',createProduct);
router.delete('/products/:id',deleteProduct);
router.put('/products/:id',updateProduct);

router.get('/order',getOrder);
router.get('/order/:id',getOrderById);
router.post('/order',createOrder);
router.delete('/order/:id',deleteOrder);
router.put('/order/:id',updateOrder);
module.exports = router;