import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [listeproduit, setListeProduit] = useState([]);
    const [listecompte, setListeCompte] = useState([]);
    const [affichageProduit, setAffichageProduit] = useState(false);
    const [affichageCompte, setAffichageCompte] = useState(false);
    const [categorie, setCategorie] = useState('');
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const axiosInstance = axios.create({
        baseURL: "http://localhost:3030",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    const recupProduit = async () => {
        await axiosInstance.get(`/dashboard/produits`)
            .then(res => {
                setListeProduit(res.data);
                setAffichageProduit(true);
            })
    }

    const recupCompte = async () => {
        await axiosInstance.get(`/dashboard/utilisateurs`)
            .then(res => {
                setListeCompte(res.data);
                setAffichageCompte(true);
            })
    }

    const deleteProduit = async (uuid) => {
        try {
            const response = await axiosInstance.delete(`/produit/${uuid}`);
            if (response.status === 200) {
                console.log("suppression réussie")
                recupProduit();
            }
		}
		catch(err){
			console.error('Erreur suppression',err);
		}	
    }

    useEffect(() => {
        recupProduit();
        recupCompte();
    }, []);

    return (
        <div>
            <div>
                <h1>Liste des produits</h1>
                <br />
                <br />
                {affichageProduit ?
                    listeproduit.map(produit => (
                        <div key={produit.uuid}>
                            <fieldset>
                                <p>{produit.nom} - {produit.description} - {produit.prix}€ - {produit.quantite} - {<div className='modif' onClick={() => { navigate("/modifierproduit") }}>modifier</div>} - {<div className='supp' onClick={() => {deleteProduit(produit.uuid)}}>supprimer</div>}</p>
                            </fieldset>
                            {/* <button onClick={()=>{supprimePanierProduit(produit.id)}} className='btn-supp'>Supprimer</button> */}
                        </div>
                    ))
                    : <p> chargement ...</p>
                }
                <br />
                <br />
                <button onClick={() => { navigate("/ajouterproduit"); }} className="btn-ajoute">Ajouter un produit</button>
            </div>
            <div>
                <h1>Liste des comptes</h1>
                <br />
                <br />
                {affichageCompte ?
                    listecompte.map(compte => (
                        <div key={compte.uuid}>
                            <fieldset>
                                <p>{compte.nom} - {compte.prenom} - {compte.email} - {compte.estadmin ? "admin" : "standard"}</p>
                            </fieldset>
                            <br />
                            {/* <button onClick={()=>{supprimePanierProduit(produit.id)}} className='btn-supp'>Supprimer</button> */}
                        </div>
                    ))
                    : <p> chargement ...</p>
                }
                <br />

                <br />
            </div>
        </div>
    )

}
