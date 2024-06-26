import React from 'react';
import { useEffect, useState,useContext } from 'react';
import axios from 'axios';
import './Dashboard.css'
import { useNavigate } from 'react-router-dom';
import { ApiContext } from '../main';

export default function Dashboard() {
    const [listeproduit, setListeProduit] = useState([]);
    const [listecompte, setListeCompte] = useState([]);
    const [affichageProduit, setAffichageProduit] = useState(false);
    const [affichageCompte, setAffichageCompte] = useState(false);
    const [categorie, setCategorie] = useState('');
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { baseURL } = useContext(ApiContext);

    const axiosInstance = axios.create({
        baseURL: baseURL,
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
            <div className='barre'>
                a
            </div>
            <div>
                <h1>Liste des produits</h1>
                <br />
                <br />
                <div className="dashboard-global">
                    {affichageProduit ?
                        listeproduit.map(produit => (
                            <div className="dashboard" key={produit.uuid}>
                                <fieldset className='dashboard-container'>
                                    <div className='dashboard-ligne'>
                                        <div className="dashboard-list">
                                            {produit.image ? ( // Vérifiez si l'image existe pour ce produit
                                                <img className="mini-img" src={`${baseURL}/${produit.image}`} alt="" />
                                            ) : (
                                                <p>Pas d'image disponible</p>
                                            )}
                                            <div className="dashboard-item">{produit.nom}</div>
                                            <div className="dashboard-item">{produit.description}</div>
                                            <div className="dashboard-item">{produit.prix}€</div>
                                            <div className="dashboard-item">Quantite: {produit.quantite}</div>
                                            <div className="dashboard-item">{<div className='modif' onClick={() => { navigate(`/modifierproduit/${produit.uuid}`) }}>Modifier</div>}</div>
                                            <div className="dashboard-item">{<div className='supp' onClick={() => {deleteProduit(produit.uuid)}}>Supprimer</div>}</div>
                                        </div>
                                        {/* {produit.nom} - {produit.description} - {produit.prix}€ - {produit.quantite}{<div className='modif' onClick={() => { navigate(`/modifierproduit/${produit.uuid}`) }}>modifier</div>}{<div className='supp' onClick={() => {deleteProduit(produit.uuid)}}>supprimer</div>} */}
                                    </div>
                                </fieldset>
                                {/* <button onClick={()=>{supprimePanierProduit(produit.id)}} className='btn-supp'>Supprimer</button> */}
                            </div>
                        ))
                        : <p> chargement ...</p>
                    }
                </div>
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
