const { Router} =  require('express');
const router = Router();

const { getProducts, createProduct, getProductById, deleteProduct, updateProductStatus } = require('../controllers/product.controller');

const {validate}= require('../authenticate');

console.log(validate)
// router.get('/',validate, getProducts);
// router.get('/:id',validate, getProductById);
router.post('/', validate, createProduct);
router.delete('/:id',validate, deleteProduct);
router.put('/:id',validate, updateProductStatus);
//router.put('/update/:id',validate, updateProduct);

module.exports = router;