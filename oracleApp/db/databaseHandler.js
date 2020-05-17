const low = require('lowdb'),
FileAsync = require('lowdb/adapters/FileAsync');

const dbDir = 'db.json';
let adapter = new FileAsync(dbDir);
var db;

async function initDb() {
  return low(adapter).then((newDb) => {
    db = newDb;
    db.defaults({ errors: {
      requests: [],
      exceptions: []
    } }).write();
  });
}

async function saveErrorResponse(source, err) {
  const errorRes = {
    source: source,
    err: err
  };

  db.get('errors')
  .get('requests') 
  .push(errorRes)
  .last()
  .assign({ id: Date.now().toString() })
  .write()
  .then(element => console.log("element added", element));
}

module.exports = {
  initDb: initDb,
  saveErrorResponse: saveErrorResponse, 
};