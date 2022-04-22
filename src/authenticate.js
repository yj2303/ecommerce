var jwt = require('jsonwebtoken');
require('dotenv').config()

const validate = (req, res, next) => {
    console.log(req.headers.authorization)
    let token = req.headers.authorization.split(' ')[1];
    console.log("asd" + token);
    if(token) {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            console.log(data.id);
            req.id = data.id;
            next();
        } catch (err) {
            console.log("validation error " + err)
            res.status(401).json({
                success: 0,
                message: "Invalid email id or password!"
            })
        }
    } else {
        res.status(401).json({
            success: 0,
            message: "Invalid email or password!"
        });
    }
}

module.exports = {validate};