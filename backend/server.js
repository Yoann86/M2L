const express = require('express');
const cors = require('cors');
const app = express();
const mariadb = require("mariadb");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
require('dotenv').config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    database : process.env.DB_DTB,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    connectionLimit: 1000
});

app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.writeHead(200,{"Content-Type":"text/html"});
    res.end("<h1>Le serveur fonctione ^^</h1>");
})

// ------------------------ CRUD ----------------------------

app.post('/inscription', async(req,res)=>{
    let conn;
    bcrypt.hash(req.body.mdp,10)
        .then(async (hash) => {
            const {prenom,nom,email} = req.body
            conn = await pool.getConnection();

            const rows = await conn.query(
                "INSERT INTO compte (prenom,nom,email,mdp) VALUES (?,?,?,?)",
                [prenom,nom,email,hash]
            );
    
            const responseData = {
                message: 'Inscription réussie',
                updatedRows: rows.affectedRows,
                };
    
            res.status(200).json(responseData);
        
        }).catch((err)=>console.log(err))
})

app.post('/inscription/mail', async(req,res)=>{
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            "SELECT * FROM compte WHERE email=?",
            [req.body.email]
        );

        if (rows.length === 0) {
            const responseData = {
                message: 'Email unique',
            };
            res.status(200).json(responseData);
            
        } 
        else {
            const responseData = { message: 'Doublon'};
            res.status(401).json(responseData);
        }
    }
    catch (err){
        console.log(err);
    }
})

app.post('/connexion', async(req,res)=>{
    let conn;
    try {
        const {email,mdp} = req.body
        conn = await pool.getConnection();
        
        const rows = await conn.query(
            "SELECT * FROM compte WHERE email=?",
            [email]
        );

        if (rows.length === 1) {
            const match = await bcrypt.compare(mdp, rows[0]["mdp"]);
            if (match) {
                const user = {"email":rows[0]["email"],
                            "prenom":rows[0]["prenom"], 
                            "nom":rows[0]["nom"]};
                const responseData = {
                    message: 'Connexion réussie',
                    user: user,
                };
                res.status(200).json(responseData);
            } else {
                const responseData = { message: 'Mdp invalide' };
                res.status(401).json(responseData);
            }
        } 
        else {
            const responseData = { message: 'Échec de la connexion' };
            res.status(401).json(responseData);
        }
    } 
    catch (err) {
        console.log(err);
    } 
})

app.listen(process.env.DB_PORT,()=>{
    console.log("Serveur à l'écoute : \x1b[34mhttp://localhost:3030/\x1b[0m");
});