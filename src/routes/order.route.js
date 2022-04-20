const { Router} =  require('express');
const router = Router();
const { getOrder, createOrder, getOrderById, deleteOrder, updateOrder } = require('../controllers/order.controller');

router.get('/',getOrder);
router.get('/:id',getOrderById);
router.post('/',createOrder);
router.delete('/:id',deleteOrder);
router.put('/:id',updateOrder);

module.exports = router;