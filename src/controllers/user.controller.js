const { pool } = require('./../db');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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
    console.log(req.body);
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
            if (error) console.log(error.message);
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
var login = async (req, res) => {
    var { email, password } = req.body;
    if (!email || !password) {
        return res.json({
            success: false,
            message: "empty fields"
        })
    }
    try {

        const results = pool.query('SELECT password FROM users WHERE email = $1', [email]);

        //const results = [2,"njdsbhfdf","svdvv","df@","Admin"];
        comparePassword = bcrypt.compare(password, results);
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




const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query("SELECT * FROM users WHERE id= $1", [id], (error, result) => {
      if (!result.rows.length) {
        res.send("no user found");
        return;
      }
  
      pool.query("SELECT roles FROM users WHERE id = $1", [id], (error, result) => {
        if (result.rows[0].roles == "admin") {
            pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
                if (error) throw error;
                res.status(200).send("user  {$id} deleted successfully");
              });
          
        } else {
            res.send("Invalid delete operation");
            return;
        }
      });
    });
  };

const updateUser = async (req, res) => {
    const id = req.params.id;
    const { name, email, password, roles } = req.body;
    const response = await pool.query('UPDATE "users" SET name = $1, email=$2 WHERE id = $3', [name, email, password, roles, id]);
    console.log(response);
    res.json('User updated successfully');
};
module.exports = {
    getUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser,
    login
}