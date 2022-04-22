const { status } = require('express/lib/response');
const { pool } = require('./../db');
const { password } = require('pg/lib/defaults');

const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
require("dotenv").config();



const createOrder = async (req, res) => {
    const { status, items, total_price, created_by } = req.body;
    const response = await pool.query('INSERT INTO Order(id,status, items,total_Price,created_by) VALUES($1, $2,$3,$4,$5)', [status, items, total_price, created_by]);
    console.log(response);
    res.json({
        message: 'Order Placed Successfully',

        order: response

    });
};


const updateOrder = async (req, res) => {
    const id = req.params.id;
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

    try {
        const { status, items, total_price, created_by } = req.body;
        if(role=="ADMIN" ) {
            const response = await pool.query('UPDATE "orders" SET status = $1, items=$2, total_price=$3, created_by=$4 WHERE id = $5', [status, items, total_price, created_by,id]);
            console.log(response);
            res.json('Order updated successfully');
        } else {
            res.json("ORDER UPDATE FAILED SUCCESSFULLY XD");
        }
    } catch(err) {
        console.log(err.message)
    }


};
module.exports = {
    
    createOrder,
    updateOrder
}