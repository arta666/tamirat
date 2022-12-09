const sqlite3 = require('sqlite3').verbose();

// open database in memory
let db = new sqlite3.Database('./tamirat.db',sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
 (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    contact_id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE
  )`)

  var stm = db.prepare("INSERT INTO contacts (first_name, phone) VALUES (?, ?)")
  for (var i = 0; i < 10; i++) {
    stm.run("IpsumA " + i,"IpsumB " + i)
  }

  stm.finalize();

  db.each("SELECT contact_id as id FROM contacts", function(erro, result) {
    console.log(result.id)
  })
});

// close the database connection
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Close the database connection.');
});