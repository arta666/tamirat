const sqlite3 = require('sqlite3')
const path = require('path')

// open database in memory
let db = new sqlite3.Database(path.join(__dirname,'../../tamirat.db'));

module.exports.getCustomers = ()=> {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.all('SELECT * FROM customers',(err, rows) => {
                if(!err) {
                    resolve(rows)
                } else {
                    reject(err)
                }
            })
        })
    })
}

module.exports.addNewCustomer = ()=> {
    return new Promise((resolve, reject) => {
         // Query
    var createQuery = 
    `CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        phone TEXT NOT NULL UNIQUE
      )`;
        var insertQuery = 
    'INSERT INTO GFG (ID , NAME) VALUES (1 , "GeeksforGeeks");'
        var selectQuery = 'SELECT * FROM GFG ;'
      
        // Running Query
        db.run(createQuery , (err) => {
            if(err) return;
      
            // Success
            console.log("Table Created");
            db.run(insertQuery , (err) => {
                if(err) return;
      
                // Success
                console.log("Insertion Done");
                db.all(selectQuery , (err , data) => {
                    if(err) return;
      
                    // Success
                    console.log(data);
                });
            });
        });
    })
}