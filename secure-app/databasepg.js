const{Client} = require('pg').Client

const user = input("Enter username");
const password = input("Enter password", {'echo': '**'})

const connectionInfo = {

    'host' : 'localhost',
    'port' : 5432,
    'database' : 'userData',
    'user' : user,
    'password' : password,

}

const sql = 'SELECT * FROM pas'

const client = new Client(connectionInfo)

client
.connect()
.then(() => client.query(sql))
.then(() => console.table())