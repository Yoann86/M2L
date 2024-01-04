const express = require('express');
const cors = require('cors');
const app = express();
const mariadb = require("mariadb");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET_KEY;

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
});

function verifierJWT(req, res, next) {
    const token = req.headers.authorization.substring(7);

    if (!token) {
        return res.status(401).json({ message: 'Pas de token, accès non autorisé' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token invalide' });
    }
}

// ------------------------ CRUD ----------------------------

app.post('/inscription', async(req,res)=>{
    let conn;
    bcrypt.hash(req.body.mdp,10)
        .then(async (hash) => {
            const {prenom,nom,email} = req.body
            conn = await pool.getConnection();
            const uuid = crypto.randomUUID();

            const rows = await conn.query(
                "INSERT INTO compte (uuid,prenom,nom,email,mdp) VALUES (?,?,?,?,?)",
                [uuid,prenom,nom,email,hash]
            );
    
            const responseData = {
                message: 'Inscription réussie',
                updatedRows: rows.affectedRows,
                };
    
            res.status(200).json(responseData);
        
        }).catch((err)=>console.log(err))
});

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
});

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
                let role = 'utilisateur';

                if (rows[0]["estadmin"]==1){
                    role = 'admin'
                }

                const payload = {
                    email: rows[0]["email"],
                    prenom: rows[0]["prenom"], 
                    nom: rows[0]["nom"],
                    uuid :rows[0]["uuid"],
                    droit: role,
                  };

                const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
                console.log(token);

                res.status(200).json(token);
            } else {
                const responseData = { message: 'Infos invalides' };
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
});

app.get('/autorisation/:token', verifierJWT, async(req,res)=>{
    const role = req.user.droit;

    if (role=="admin"){
        res.status(200).json(1);
    }
    else {
        res.status(200).json(0);
    }
});

// ------------------------ Produits ----------------------------

app.get('/produit', async(req,res)=>{
    let conn;

    try{
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM produit");
        res.status(200).json(rows);
    }
    catch(err){
        console.log(err);
    }

});

app.get('/produit/:uuid', verifierJWT, async(req,res)=>{
    let conn;
    const role = req.user.droit;
    const uuid = req.params.uuid;

    if (role=='admin'){
        try{
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * FROM produit WHERE uuid = ?",[uuid]);
            res.status(200).json(rows);
    
        }
        catch(err){
            console.log(err);
        }
    } else {
        const responseData = { message: "Vous n'avez pas les authorisations requises !" };
        res.status(403).json(responseData);
    }
});

app.delete('/produit/:uuid', verifierJWT, async(req,res)=>{
    let conn;
    const role = req.user.droit;
    const uuid = req.params.uuid;
    
    console.log(uuid)

    if (role=='admin'){
        try{
            conn = await pool.getConnection();
            const rows = await conn.query("DELETE FROM produit WHERE uuid = ?",[uuid]);
            const responseData = {
                message: 'suppression confirmée',
                updatedRows: rows.affectedRows,
            };
            res.status(200).json(responseData);
    
        }
        catch(err){
            console.log(err);
        }
    } else {
        const responseData = { message: "Vous n'avez pas les authorisations requises !" };
        res.status(403).json(responseData);
    }
});

app.post('/produit/panier', verifierJWT, async(req,res)=>{ 
    let conn;
    const uuidCompte = req.user.uuid;
    const {uuidProduit,quantite} = req.body;

    try{
        conn = await pool.getConnection();

        const testProd = await conn.query("SELECT * FROM panier WHERE uuid_produit = ? AND uuid_compte = ? ",[uuidProduit,uuidCompte]);

        if (testProd.length>0){
            const modif = await conn.query(
                "UPDATE panier SET quantite = quantite + ? WHERE uuid_produit = ? AND uuid_compte = ?",
                [quantite,uuidProduit,uuidCompte]
            );
            res.status(200).json(modif.affectedRows);
        }
        else {
            const rows = await conn.query(
                "INSERT INTO panier (uuid_compte,uuid_produit,quantite) VALUES (?,?,?)",
                [uuidCompte,uuidProduit,quantite]
            );
            const responseData = {
                message: 'Ajout confirmé',
                updatedRows: rows.affectedRows,
                };
    
            res.status(200).json(responseData);
        }
        
        
    } 
    catch(err){
        console.log(err);
    }
});

// ------------------------ Panier -----------------------------

app.get('/panier/:token', verifierJWT, async(req,res)=>{
    let conn;
    const uuid = req.user.uuid;

    try{
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT panier.id,produit.uuid,produit.nom,produit.description,produit.prix,panier.quantite FROM panier,produit WHERE uuid_compte= ?  AND uuid_produit = produit.uuid ",[uuid]);
        res.status(200).json(rows);

    }
    catch(err){
        console.log(err);
    }

});

app.delete('/panier/compte/:token', verifierJWT, async(req,res)=>{
    let conn;
    const uuid = req.user.uuid;

    try{
        conn = await pool.getConnection();
        const rows = await conn.query("DELETE FROM panier WHERE uuid_compte = ? ",[uuid]);
        const responseData = {
            message: 'suppression confirmée',
            updatedRows: rows.affectedRows,
            };

        res.status(200).json(responseData);
    }
    catch(err){
        console.log(err);
    }
});

app.delete('/panier/compte/produit/:idPanier', async(req,res)=>{
    let conn;
    const idPanier = parseInt(req.params.idPanier);
    
    try{
        conn = await pool.getConnection();
        const rows = await conn.query("DELETE FROM panier WHERE id = ? ",[idPanier]);
        const responseData = {
            message: 'suppression confirmée',
            updatedRows: rows.affectedRows,
            };

        res.status(200).json(responseData);
    }
    catch(err){
        console.log(err);
    }
});

app.put('/panier/validation/:token', verifierJWT, async(req,res)=>{
    let conn;
    const uuid = req.user.uuid;
    
    try{
        conn = await pool.getConnection();
        const rows = await conn.query(
            "SELECT produit.nom FROM panier JOIN produit ON panier.uuid_produit = produit.uuid WHERE panier.uuid_compte = ? AND produit.quantite < panier.quantite",
            [uuid]
        );

        if (rows.length>0){
            const msg = {
                error: 'Quantité insuffisante en stock',
                message: 'La quantité demandée dépasse les stocks disponibles dans le magasin.'
            };
        
            res.status(409).json(msg)
        }
        
        else {
            const updatestock = await conn.query(
                "UPDATE produit JOIN panier ON produit.uuid = panier.uuid_produit SET produit.quantite = produit.quantite - panier.quantite WHERE uuid_produit = produit.uuid AND uuid_compte = ?",
                [uuid]
            )
            res.status(200).json(updatestock.updatedRows);
        }
    }
    catch(err){
        console.log(err);
    }
});

// ------------------------ Admins -----------------------------

app.get('/dashboard/produits',verifierJWT, async(req,res)=>{
    let conn;
    const role = req.user.droit;

    if (role=='admin'){
        try{
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * FROM produit");
            res.status(200).json(rows);
    
        }
        catch(err){
            console.log(err);
        }
    } else {
        const responseData = { message: "Vous n'avez pas les authorisations requises !" };
        res.status(403).json(responseData);
    }
});

app.get('/dashboard/utilisateurs',verifierJWT, async(req,res)=>{
    let conn;
    const role = req.user.droit;

    if (role=='admin'){
        try{
            conn = await pool.getConnection();
            const rows = await conn.query("SELECT * FROM compte");
            res.status(200).json(rows);
    
        }
        catch(err){
            console.log(err);
        }
    } else {
        const responseData = { message: "Vous n'avez pas les authorisations requises !" };
        res.status(403).json(responseData);
    }
});

app.post('/dashboard/ajouterproduit',verifierJWT, async(req,res)=>{
    let conn;
    const role = req.user.droit;

    if (role=='admin'){
        try{
            const {nom,description,prix,quantite} = req.body
            conn = await pool.getConnection();
            const uuid = crypto.randomUUID();

            const rows = await conn.query(
                "INSERT INTO produit (uuid,nom,description,prix,quantite) VALUES (?,?,?,?,?)",
                [uuid,nom,description,prix,quantite]
            );
    
            const responseData = {
                message: 'Ajout réussi',
                updatedRows: rows.affectedRows,
                };
    
            res.status(200).json(responseData);
    
        }
        catch(err){ 
            console.log(err);
        }
    } else {
        const responseData = { message: "Vous n'avez pas les authorisations requises !" };
        res.status(403).json(responseData);
    }
});

app.put('/dashboard/modifierproduit', verifierJWT, async(req,res)=>{
    let conn;
    const role = req.user.droit;

    if (role=='admin'){
        try{
            const {uuid,nom,description,prix,quantite} = req.body
            conn = await pool.getConnection();

            const rows = await conn.query(
                "UPDATE produit SET nom = ?,description = ?,prix = ?,quantite = ? WHERE uuid = ?",
                [nom,description,prix,quantite,uuid]
            );
    
            const responseData = {
                message: 'Modif réussi',
                updatedRows: rows.affectedRows,
                };
    
            res.status(200).json(responseData);
    
        }
        catch(err){ 
            console.log(err);
        }
    } else {
        const responseData = { message: "Vous n'avez pas les authorisations requises !" };
        res.status(403).json(responseData);
    }
});

// app.get('/testest',verifierJWT, async(req,res)=>{

// })

//
app.listen(process.env.DB_PORT,()=>{
    console.log("Serveur à l'écoute : \x1b[34mhttp://localhost:3030/\x1b[0m");
});
