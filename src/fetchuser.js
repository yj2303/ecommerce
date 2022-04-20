var jwt = require('jsonwebtoken');
require('dotenv').config()

const userServices = (req, res, next) => {
    
    const token = req.header('auth-token');
    try {
        const userName = jwt.verify(token, process.env.JWT_SECRET);
        console.log(userName)
        req.user = userName.user;
        const role = userName.roles
        console.log("roles "+ roles)
        next();
    } catch (error) {
        res.status(401).send({ error: "Invalid credentials" })
    }
}