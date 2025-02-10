const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");

const fs = require('fs');
const mysql = require('mysql2');
const conf = JSON.parse(fs.readFileSync('conf.json'));
conf.ssl.ca = fs.readFileSync(__dirname + '/ca.pem');
const connection = mysql.createConnection(conf);

const app = express();


app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/", express.static(path.join(__dirname, "public")));

app.post("/carosello/add", (req, res) => {
  const carosello = req.body.carosello;

  insert(carosello);

  res.json({ result: "Ok" });
});

app.get("/carosello", (req, res) => {
  select().then(carosellos => res.json({ carosellos: carosellos }));
});

app.put("/carosello/complete", (req, res) => {
  const carosello = req.body;

  try {
    select()
    .then(carosellos => {
      carosellos.map((element) => {
      if (element.id === carosello.id) {
        element.completed = !element.completed;
        update(element);
      }

      return element;
    });
    })
    
  } catch (e) {
    console.log(e);
  }
  res.json({ result: "Ok" });
});

app.delete("/carosello/:id", (req, res) => {
  select()
  .then(carosellos => {
    carosellos = carosellos.filter((element) => element.id == req.params.id);
    remove(carosellos[0]);
  })
  
  res.json({ result: "Ok" });
});



const executeQuery = (sql) => {
    return new Promise((resolve, reject) => {      
          connection.query(sql, function (err, result) {
             if (err) {
                console.error(err);
                reject();     
             }   
             console.log('done');
             resolve(result);         
       });
    })
 }

 const createTable = () => {
    return executeQuery(`
    CREATE TABLE IF NOT EXISTS carosello
       ( id INT PRIMARY KEY AUTO_INCREMENT, 
          name VARCHAR(255) NOT NULL, 
          completed BOOLEAN ) 
       `);      
 }

 const insert = (carosello) => {
    const template = `
    INSERT INTO carosello (name, completed) VALUES ('$NAME', '$COMPLETED')
       `;
    let sql = template.replace("$NAME", carosello.name);
    sql = sql.replace("$COMPLETED", carosello.completed ? 1 : 0);
    return executeQuery(sql); 
 }

 const select = () => {
    const sql = `
    SELECT id, name, completed FROM carosello 
       `;
    return executeQuery(sql); 
 }

 const update = (carosello) =>{
    let sql = `
    UPDATE carosello SET completed = '$COMPLETED' WHERE id = '$ID'
    `;

    sql = sql.replace("$COMPLETED", carosello.completed  ? 1 : 0);
    sql = sql.replace("$ID", carosello.id);
    return executeQuery(sql); 
 }


 const remove = (carosello) => {
  let sql =  `
  DELETE FROM carosello WHERE id = '$ID'
  `;

  sql = sql.replace("$ID", carosello.id);
  return executeQuery(sql); 
 }

 
 createTable().then ( () => {
  const server = http.createServer(app);

  server.listen(80, () => {
    console.log("- server running");
  })
  }
);
