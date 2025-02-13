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
const multer  = require('multer');


let storage = multer.diskStorage({
   destination: function (req, file, callback) {
       callback(null, path.join(__dirname, "files"));
   },
   filename: function (req, file, callback) {
       callback(null, file.originalname);
   }
});
const upload = multer({ storage: storage}).single('file');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
   extended: true
}));
conf.ssl = {
    ca: fs.readFileSync(__dirname + '/ca.pem')
}
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/files", express.static(path.join(__dirname, "files")));


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
          url VARCHAR(255) NOT NULL ) 
       `);      
 }
 const insert = (img) => {
    const template = `
    INSERT INTO carosello (url) VALUES ('$URL')
       `;
    let sql = template.replace("$URL", img.url);
    return executeQuery(sql); 
 }
 const select = () => {
    const sql = `
    SELECT id, url FROM carosello 
       `;
    return executeQuery(sql); 
 }
 const del = (id) => {
    let sql = `
    DELETE FROM carosello
    WHERE id=$ID
    `;
    sql = sql.replace("$ID", id); 
    return executeQuery(sql);
};

 const test = async () => {
    await createTable();
    const carosello = await select();
    console.log("Risultato della query SELECT:", carosello);
};
test();

app.post("/carosello/add", (req, res) => {
      upload(req,res,error=>{
         const img=req.file.filename;
         insert({url: ("/files/"+img)}).then(res.json({result: "Ok"}));
      })
 });

 app.get("/carosello", async (req, res) => {
    try {
        const carosello = await select();
        res.json({ carosello : carosello });
    } catch (error) {
        res.status(500).json({ error: "Errore del server" });
    }
});

app.delete("/carosello/:id", async (req, res) => {
    try {
      await del(req.params.id); 
      res.json({ result: "Ok" });
    } catch (error) {
      res.status(500).json({ error: "Errore durante l'eliminazione" });
    }
  });

  
createTable().then ( () => {
  const server = http.createServer(app);
    server.listen(80, () => {
      console.log("- server running");
    })
  }
);

