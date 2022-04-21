const { status } = require('express/lib/response');
const { pool } = require('./../db');
const { password } = require('pg/lib/defaults');

const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
require("dotenv").config();

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
    const data = jwt.verify(token, "df@");
    const role = data.roles;

    if (role == "admin" || role == "vendor") {
        pool.query('INSERT INTO product(status, title,pictureURL,price,createdBy) VALUES($1, $2,$3,$4,$5)', [newProductStatus, title, pictureURL, price, createdBy]);


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
    res.json('User ${id} deleted successfully');
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

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    deleteProduct,
    updateProduct,

}