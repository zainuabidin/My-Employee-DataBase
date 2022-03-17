const mysql = require('mysql2');
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL Username
      user: 'root',
      // TODO: Add MySQL Password
      password: '00000000',
      database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
  );
  module.exports=db
