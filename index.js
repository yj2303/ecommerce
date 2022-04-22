const express =  require('express');
const app = express();

 
const orderRoute = require("./src/routes/order.route");
const productRoute = require("./src/routes/product.route");
const userRoute = require("./src/routes/user.route");


//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.get('/', (req, res) => res.status(200).json({
    success: 1,
    message: 'This is the home page'
}));
//routes
app.use('/order', orderRoute);
app.use('/users', userRoute);
app.use('/product', productRoute);

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const port=3015;
app.listen((process.env.PORT||3015), ()=>{console.log('listening to the port' + port)});
