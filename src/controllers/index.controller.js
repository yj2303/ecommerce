const { status } = require('express/lib/response');
const { Pool } = require('pg');
const { password } = require('pg/lib/defaults');

const pool = new Pool({
    user:"postgres",
    host : "localhost",
    database : "postgres",
    password : "Yashika@123",
    port: 5432
})

const getUsers = async (req,res)=>{
    try
    {
        const response = await pool.query('SELECT * FROM "users"');
        res.status(200).json(response.rows);
    }
    catch(error){
        console.log(error);
        res.send("Error: "+error);
    }
};

const getProductById = async(req,res) => {
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM "products" WHERE id = $1',[id]);
    res.json(response.rows);
};

const createProduct = async (req,res)=>{
    const {status, title, pictureURL,price,createdBy} = req.body;
    const response = await pool.query('INSERT INTO products(status, title,pictureURL,price,createdBy) VALUES($1, $2,$3,$4,$5)',[status,title,pictureURL,price,createdBy ]);
    console.log(response);
    res.json({
        message: 'Product Added Successfully',
        body:{
            products:{status,title,pictureURL,price,createdBy}
        }
    });
};

const deleteProduct = async(req,res) =>{
    const id = req.params.id;
    const response = await pool.query('DELETE FROM "products" WHERE id = $1',[id]);
    console.log(response);
    res.json(`Product ${id} deleted successfully`);
};

const updateProduct = async(req,res) => {
    const id = req.params.id;
    const {status, title, pictureURL,price,createdBy} = req.body;
    const response = await pool.query('UPDATE "products" SET status = $1, title=$2, pictureURL=$3, price=$4,createdBy=$5 WHERE id = $6',[status, title,pictureURL,price,createdBy]);
    console.log(response);
    res.json('Product updated successfully');
};
const getProducts = async (req,res)=>{
    try
    {
        const response = await pool.query('SELECT * FROM "products"');
        res.status(200).json(response.rows);
    }
    catch(error){
        console.log(error);
        res.send("Error: "+error);
    }
};

const getUserById = async(req,res) => {
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM "users" WHERE id = $1',[id]);
    res.json(response.rows);
};

const createUser = async (req,res)=>{
    const {name, email,password,roles} = req.params;
    console.log(req.params);
    const response = await pool.query('INSERT INTO users(name, email, password, roles) VALUES($1, $2, $3, $4)',[name, email, password,roles ]);
    console.log(response);
    res.json({
        message: 'User Added Successfully',
        body:{
            user:{name,email, password,roles}
        }
    });
};

const deleteUser = async(req,res) =>{
    const id = req.params.id;
    const response = await pool.query('DELETE FROM "users" WHERE id = $1',[id]);
    console.log(response);
    res.json(`User ${id} deleted successfully`);
};

const updateUser = async(req,res) => {
    const id = req.params.id;
    const {name, email, password, roles} = req.body;
    const response = await pool.query('UPDATE "users" SET name = $1, email=$2 WHERE id = $3',[name, email,password, roles, id]);
    console.log(response);
    res.json('User updated successfully');
};
const getOrderById = async(req,res) => {
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM "order" WHERE id = $1',[id]);
    res.json(response.rows);
};

const createOrder = async (req,res)=>{
    const {status, items, totalPrice,createdBy} = req.body;
    const response = await pool.query('INSERT INTO order(status, items,totalPrice,createdBy) VALUES($1, $2,$3,$4)',[status,items,totalPrice,createdBy ]);
    console.log(response);
    res.json({
        message: 'Order Placed Successfully',
        body:{
            product:{status,items,totalPrice,createdBy}
        }
    });
};

const deleteOrder = async(req,res) =>{
    const id = req.params.id;
    const response = await pool.query('DELETE FROM "order" WHERE id = $1',[id]);
    console.log(response);
    res.json(`Order ${id} deleted successfully`);
};

const updateOrder = async(req,res) => {
    const id = req.params.id;
    const {status, items, totalPrice, createdBy} = req.body;
    const response = await pool.query('UPDATE "products" SET status = $1, items=$2, totalPrice=$3, createdBy=$4 WHERE id = $5',[status, items,totalPrice,createdBy]);
    console.log(response);
    res.json('Order updated successfully');
};
const getOrder = async (req,res)=>{
    try
    {
        const response = await pool.query('SELECT * FROM "order"');
        res.status(200).json(response.rows);
    }
    catch(error){
        console.log(error);
        res.send("Error: "+error);
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser,
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,
    getOrder,
    getOrderById,
    createOrder,
    deleteOrder,
    updateOrder
}