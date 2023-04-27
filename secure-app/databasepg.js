const{Client} = require('pg');

const client = new Client({

    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "1234",
    database: "dssdata"

})

module.exports = client;
