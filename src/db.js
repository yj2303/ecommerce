const { Pool } = require('pg');
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "Yashika@123",
    port: 5432
})

module.exports= {pool};