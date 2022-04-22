const { Router} =  require('express');
const router = Router();
const { createOrder, updateOrder } = require('../controllers/order.controller');
const {validate}= require('../authenticate');


// router.get('/',getOrder);
// router.get('/:id',getOrderById);
router.post('/',validate, createOrder);
// router.delete('/:id',validate, deleteOrder);
router.put('/:id',validate, updateOrder);

module.exports = router;