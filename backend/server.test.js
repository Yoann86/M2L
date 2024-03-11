const request = require('supertest');
const app = require('./server');
let tokenCompte;
let tokenAdmin;
let uuid;

describe('Sans compte', ()=>{
    // Test de l'affichage des produits
    it('Affichage produits', async ()=>{
        const res = await request(app)
            .get('/produit')
        expect(res.status).toEqual(200)
    })
});

describe('Inscription/connexion', ()=>{
    // Test de l'inscription d'un utilisateur
    it('Inscription', async ()=>{
        const data = {
            nom: 'Doe',
            prenom: "John",
            mdp: "1234",
            email: 'johndoe@example.com'
        };
        const res = await request(app)
            .post('/inscription').send(data)
        expect(res.status).toEqual(200)
    })
    // Test de la détection de l'email doublon pour le compte créé par le test précédent
    it('Doublon mail', async ()=>{
        const data = {
            email: 'johndoe@example.com'
        };
        const res = await request(app)
            .post('/inscription/mail').send(data)
        expect(res.status).toEqual(401)
    })
    // Test de la connexion avec des informations erronées (identifiant ou mdp)
    it('Connexion refusée ', async ()=>{
        const data = {
            mdp: "12345",
            email: 'johndoe@example.com'
        };
        const res = await request(app)
            .post('/connexion').send(data)
        expect(res.status).toEqual(401)
    })
    // Test de la connexion avec le compte créé précédemment et récupération du token
    it('Connexion réussie', async ()=>{
        const data = {
            mdp: "1234",
            email: 'johndoe@example.com'
        };
        const res = await request(app)
            .post('/connexion').send(data)
        tokenCompte = res.body;
        expect(res.status).toEqual(200)
    })
});

describe("Dashboard de l'admin", ()=>{
    //Test de la connexion a un compte admin
    it('Connexion admin', async ()=>{
        const data = {
            mdp: "a",
            email: 'a'
        };
        const res = await request(app)
            .post('/connexion').send(data)
        tokenAdmin = res.body;
        expect(res.status).toEqual(200)
    })
    // Test de l'affichage des produits sur le dashboard
    it('Affichage des produits (dashboard)', async ()=>{
        const headers = {
            Authorization: `Bearer ${tokenAdmin}`,
            'Content-Type': 'application/json',
        };
        const res = await request(app)
            .get('/dashboard/produits')
            .set(headers)    
        expect(res.status).toEqual(200)
    })
    // Test de l'affichage des utilisateurs sur le dashboard
    it('Affichage des utilisateurs (dashboard)', async ()=>{
        const headers = {
            Authorization: `Bearer ${tokenAdmin}`,
            'Content-Type': 'application/json',
        };
        const res = await request(app)
            .get('/dashboard/utilisateurs')
            .set(headers)    
        expect(res.status).toEqual(200)
    })
    // Test de l'ajout d'un produit dans la base de donnée avec une quantité de 1 '
    it('Ajouter un produit', async ()=>{
        const headers = {
            Authorization: `Bearer ${tokenAdmin}`,
            'Content-Type': 'application/json',
        };
        const data = {
            nom:"test", 
            description:"desc test", 
            prix:"10", 
            quantite:"3",
        };
        const req = {
            file: {
                path: './uploads/ababb1d394f3abe5459dc59494b5107bcbb20277_WR126910U_01.webp' // Adresse fictive du fichier
            }
        };
        const res = await request(app)
            .post('/dashboard/ajouterproduit')
            .set(headers)
            .field(data)
            .attach('image', req.file.path)    
        expect(res.status).toEqual(200)
        uuid = res.body.uuid
    })
    // Test de la modification d'un produit 
    it("Modification du produit", async ()=>{
        const headers = {
            Authorization: `Bearer ${tokenAdmin}`,
            'Content-Type': 'application/json',
        };
        const data = {
            nom:"Raquette modifiée", 
            description:"Une raquette de qualité", 
            prix:"28", 
            quantite:"1",
        };
        const res = await request(app)
            .put(`/dashboard/modifierproduit/${uuid}`)
            .set(headers)
            .send(data)
        expect(res.status).toEqual(200)
    })
});

describe("Panier de l'utilisateur", ()=>{
    // Test de la récupération des droits pour un compte 
    it('Autorisation', async ()=>{
        const headers = {
            Authorization: `Bearer ${tokenCompte}`,
            'Content-Type': 'application/json',
        };
        const res = await request(app)
            .get(`/autorisation/${tokenCompte}`)
            .set(headers)
        expect(res.status).toEqual(200)
        expect(res.body).toEqual(0)
    })
    // Test de l'ajout du produit (créé précédemment) au panier avec une quantité de 1
    it('Ajouter au panier (quantité 1)', async ()=>{
        const headers = {
            Authorization: `Bearer ${tokenCompte}`,
            'Content-Type': 'application/json',
        };
        const data = {
            uuidProduit: uuid,
            quantite: 1,
        };
          
        const res = await request(app)
            .post(`/produit/panier`)
            .set(headers)
            .send(data)
        expect(res.status).toEqual(200)
    })
    // Test de l'affichage du panier
    it('Afficher le panier', async ()=>{
        const headers = {
            Authorization: `Bearer ${tokenCompte}`,
            'Content-Type': 'application/json',
        };
        const res = await request(app)
            .get(`/panier/${tokenCompte}`)
            .set(headers)
        expect(res.status).toEqual(200)
        expect(res.body[0]["uuid"]).toEqual(uuid) 
    })
    // Test de la validation du panier quand la quantité est suffisante
    it('Validation du panier réussie', async()=>{
        const headers = {
            Authorization: `Bearer ${tokenCompte}`,
            'Content-Type': 'application/json',
        };
        const res = await request(app)
            .put(`/panier/validation/${tokenCompte}`)
            .set(headers)
        expect(res.status).toEqual(200)
    })
    // Test de l'ajout d'un produit à nouveau pour dépasser les stocks
    it('Ajouter au panier à nouveau (quantité 1)', async ()=>{
        const headers = {
            Authorization: `Bearer ${tokenCompte}`,
            'Content-Type': 'application/json',
        };
        const data = {
            uuidProduit: uuid,
            quantite: 1,
        };
          
        const res = await request(app)
            .post(`/produit/panier`)
            .set(headers)
            .send(data)
        expect(res.status).toEqual(200)
    })
    // Test de la validation du panier quand les stocks dépassent
    it('Validation du panier impossible (hors stock)', async()=>{
        const headers = {
            Authorization: `Bearer ${tokenCompte}`,
            'Content-Type': 'application/json',
        };
        const res = await request(app)
            .put(`/panier/validation/${tokenCompte}`)
            .set(headers)
        expect(res.status).toEqual(409)
    })
    // Test de la suppression du panier
    it('Suppression du panier', async ()=>{
        const headers = {
            Authorization: `Bearer ${tokenCompte}`,
            'Content-Type': 'application/json',
        };
        const res = await request(app)
            .delete(`/panier/compte/${tokenCompte}`)
            .set(headers)
        expect(res.status).toEqual(200)
    })
    // Test de la suppression du produit test créé et modifié précédemment
    it("Suppression du produit (dashboard)", async ()=>{
        const headers = {
            Authorization: `Bearer ${tokenAdmin}`,
            'Content-Type': 'application/json',
        };
        const res = await request(app)
            .delete(`/produit/${uuid}`)
            .set(headers)
        expect(res.status).toEqual(200)
    })
});

// Suppression du compte créé précédemment pour effectuer les tests
afterAll(async ()=>{
    const res = await request(app)
        .delete(`/john`)
    expect(res.status).toEqual(200)
    return;
});