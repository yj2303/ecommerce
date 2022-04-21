const { status } = require('express/lib/response');
const { Pool } = require('pg');
const { password } = require('pg/lib/defaults');

const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
require("dotenv").config();



const getUsers = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM "users"');
        res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error);
        res.send("Error: " + error);
    }
};
const getUserById = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM "users" WHERE id = $1', [id]);
    res.json(response.rows);
};

const createUser = async (req, res) => {

    const { name, email, password, roles } = req.body;
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);
    if (!name || !email || !password || !roles) {
        return res.json({
            success: false,
            message: "empty fields"
        })
    }

    console.log(req.body);
    const response = await pool.query('INSERT INTO users(name, email, password, roles) VALUES($1, $2, $3, $4)', [name, email, password, roles],
        (error, results) => {
            const authtoken = jwt.sign(
                { name, email, password, roles },
                process.env.JWT_SECRET
            );
            if (error) throw error;
            res.status(201).json(authtoken);
        });
    console.log(response);
    res.json(
        {
            success: true,
            message: 'User Added Successfully',
            body: {
                user: { name, email, password, roles }
            }
        }
        //req.body
    );
};
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({
            success: false,
            message: "empty fields"
        })
    }
    const results = pool.query("SELECT * FROM users WHERE email = $1", [email])
    try {
      
      
        if (!results.rows.length) {
            return res.status(400).json({
                error: "Invalid user",
            });
        }
        const comparePassword = bcrypt.compare(password, results.rows[0].password);
        if (!comparePassword) {
            return res.status(400).json({
                error: "Invalid credentials",
            });
        }
        const authtoken = jwt.sign({ email, password }, process.env.JWT_SECRET);
        res.status(201).json(authtoken);
    } catch (error) {
        console.log("error is here", error)

        res.status(500).json({
            error: error.message,
        });
    }
};
const deleteUser = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('DELETE FROM "users" WHERE id = $1 and roles= "admin"', [id]);
    console.log(response);
    res.json(`User ${id} deleted successfully`);
    pool.query('SELECT roles FROM users WHERE id = $1', [id], (error, result) => {
        const isAdmin = result.rows[0].roles;
        if (isAdmin == "admin") {
            pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
                if (error) throw error;
                res.status(200).send("user deleted successfully");
            });

        } else {
            res.send("Invalid operation");
            return;
        }
    });
};

const updateUser = async (req, res) => {
    const id = req.params.id;
    const { name, email, password, roles } = req.body;
    const response = await pool.query('UPDATE "users" SET name = $1, email=$2 WHERE id = $3', [name, email, password, roles, id]);
    console.log(response);
    res.json('User updated successfully');
};
const getProducts = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM "product"');
        res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error);
        res.send("Error: " + error);
    }
};
const getProductById = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM "product" WHERE id = $1', [id]);
    res.json(response.rows);
};

const createProduct = async (req, res) => {

    const { status, title, pictureURL, price, createdBy } = req.body;
    if (!status || !title || !pictureURL || !price || !createdBy) {
        return res.json({
            success: false,
            message: "empty fields"
        })
    }
    console.log(req.body);
    const newProductStatus = "draft";
    const token = req.header("auth-token");
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const role = data.roles;

    if (role == "admin" || role == "vendor") {
        const response = await pool.query('INSERT INTO product(status, title,pictureURL,price,createdBy) VALUES($1, $2,$3,$4,$5)', [newProductStatus, title, pictureURL, price, createdBy]);

        console.log(response);
        res.json(
            {
                success: true,
                message: 'Product Added Successfully',
                body: {
                    product: { status, title, pictureURL, price, createdBy }
                }
            }

            //req.body
        );
    }
};

const deleteProduct = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('DELETE FROM "product" WHERE id = $1 and roles= "admin"', [id]);
    console.log(response);
    res.json(`User ${id} deleted successfully`);
    pool.query('SELECT roles FROM "product" WHERE id = $1', [id], (error, result) => {
        const isAdmin = result.rows[0].roles;
        if (isAdmin == "admin") {
            pool.query('DELETE FROM "product" WHERE id = $1', [id], (error, results) => {
                if (error) throw error;
                res.status(200).send("Product deleted successfully");
            });

        } else {
            res.send("Invalid operation");
            return;
        }
    });
};

const updateProduct = async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const token = req.header("auth-token");
    const data = jwt.verify(token, process.env.JWT_SECRET);
    const role = data.roles;
    pool.query('SELECT * FROM "product" WHERE id=$1', [id], (error, result) => {
        if (role == "admin" || role == "vendor") {
            pool.query("UPDATE products SET status=$1, title=$2, pictureurl=$3, price=$4 WHERE id=$5", [status, id], (error, result) => {
                if (error) throw error;

                res.status(200).send("Updated product successfully");
            });
        } else {
            res.send("Only Admin or Vendors can update products");
        }
    }

    )
};


const getOrder = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM "Order"');
        res.status(200).json(response.rows);
    }
    catch (error) {
        console.log(error);
        res.send("Error: " + error);
    }
};

const getOrderById = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('SELECT * FROM "Order" WHERE id = $1', [id]);
    res.json(response.rows);
};

const createOrder = async (req, res) => {
    const { status, items, total_price, created_by } = req.body;
    const response = await pool.query('INSERT INTO Order(id,status, items,total_Price,created_by) VALUES($1, $2,$3,$4,$5)', [status, items, total_price, created_by]);
    console.log(response);
    res.json({
        message: 'Order Placed Successfully',

        order: response

    });
};


const deleteOrder = async (req, res) => {
    const id = req.params.id;
    const response = await pool.query('DELETE FROM "Order" WHERE id = $1', [id]);
    console.log(response);
    res.json(`Order ${id} deleted successfully`);
};

const updateOrder = async (req, res) => {
    const id = req.params.id;
    const { status, items, total_price, created_by } = req.body;
    const response = await pool.query('UPDATE "Order" SET status = $1, items=$2, total_price=$3, created_by=$4 WHERE id = $5', [status, items, total_price, created_by]);
    console.log(response);
    res.json('Order updated successfully');
};






module.exports = {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser,
    login,
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