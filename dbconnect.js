const mysql = require('mysql')


const connection =mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'nodemysql'
})

connection.connect((err)=>{
    if(err) throw err
    console.log('connected')
    // connection.query("CREATE TABLE ALLDATA()")
})

module.exports = connection