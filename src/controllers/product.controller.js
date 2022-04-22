const { status } = require('express/lib/response');
const { pool } = require('./../db');
const { password } = require('pg/lib/defaults');

const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
require("dotenv").config();


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
    // const token = req.header("auth-token");
    // const data = jwt.verify(token, "df@");
            const userId = req.id;
            // Get user role form given id
            console.log(userId)
            let role;
            try {
                const getRoleData =  await pool.query('SELECT roles FROM users WHERE id=$1', [userId]);
                console.log(getRoleData)
                role = getRoleData.rows[0].roles;
            } catch(err) {
                console.log(err.message)
            }


    if (role == "ADMIN" || role == "VENDOR") {
        console.log("authhhhhhhhh success");
        try {
            await pool.query('INSERT INTO products(status, title,picture_url,price,created_by) VALUES($1, $2,$3,$4,$5)', [newProductStatus, title, pictureURL, price, createdBy]);

        } catch (err) {
            console.log(err.message);
        }
        
        console.log("req.body-2");

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
    const userId = req.id;
    console.log(userId)
    let role;
    try {
        const getRoleData =  await pool.query('SELECT roles FROM users WHERE id=$1', [userId]);
        console.log(getRoleData)
        role = getRoleData.rows[0].roles;
    } catch(err) {
        console.log(err.message)
    }

    try {
        if(role=="ADMIN" ){
            const response = await pool.query('DELETE FROM "products" WHERE id = $1 ', [id]);
            console.log(response);
            res.json("User "+ id +" deleted successfully");
        }
        res.json({
            error: "Invalid role"
        })
        
    } catch (err) {
        console.log(err.message)
    }
    
};

const updateProductStatus = async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const userId = req.id;
    console.log(userId)
    
    let role;
    try {
        const getRoleData =  await pool.query('SELECT roles FROM users WHERE id=$1', [userId]);
        console.log(getRoleData)
        role = getRoleData.rows[0].roles;
    } catch(err) {
        console.log(err.message)
    }

    if (role == "ADMIN" || role == "VENDOR")  {
        await pool.query("UPDATE products SET status=$1 WHERE id=$2", [status, id]);
        res.status(200).send("Updated product successfully");
    }else {
        res.send("Only Admin or Vendors can update products");
    }
    
};

module.exports = {
    createProduct,
    deleteProduct,
    updateProductStatus,
}