const express =  require('express');
const app = express();



//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//routes
app.use(require('../routes/index'));

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const port=3013;
app.listen((process.env.PORT||3013), ()=>{console.log('listening to the port ${port}')});
