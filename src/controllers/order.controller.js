const { status } = require('express/lib/response');
const { pool } = require('./../db');
const { password } = require('pg/lib/defaults');

const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
require("dotenv").config();

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
    getOrder,
    getOrderById,
    createOrder,
    deleteOrder,
    updateOrder
}