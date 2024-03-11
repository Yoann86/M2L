import React from 'react'
import {useEffect,useState} from 'react';
import axios from 'axios';
import './Panier.css'

export default function Panier() {
    const [listepanier, setListePanier] = useState([]);
    const [affichage, setAffichage] = useState(false);
    const [histo,setHisto] = useState([]);
    const [affichageHisto, setAffichageHisto] = useState(false);
    const [categorie, setCategorie] = useState('');
    const token = localStorage.getItem("token");

    const axiosInstance = axios.create({
        baseURL: "http://localhost:3030",
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json', 
        },
    });

    const recup = async ()=>{
        await axiosInstance.get(`/panier/${token}`)
            .then( res => {
                setListePanier(res.data);
                setAffichage(true);
            })
    }

    const recupHisto = async ()=>{
        await axiosInstance.get(`/historique/${token}`)
            .then( res => {
                setHisto(res.data);
                setAffichageHisto(true);
            })
    }

    const supprimePanier = async () => {
        await axiosInstance.delete(`/panier/compte/${token}`);
        recup();
    }

    const supprimePanierProduit = async (uuidProduit) => {
        await axiosInstance.delete(`/panier/compte/produit/${uuidProduit}`);
        recup(); 
    }

    const validePanier = async ()=> {
        axiosInstance.put(`/panier/validation/${token}`)
        .then(response => {
            if (response.status === 200){
                supprimePanier();
            }
        })
        .catch(error => {
            if (error.response.status === 409) {
                alert("La quantité d'un des produits de votre panier dépasse les stocks disponibles !");
            } else {
                console.error(error);
        }
    });
    }

    useEffect(()=>{
        recup();
        recupHisto();
    },[]);

        return (
        <div>
            <div className='barre'>
				a
			</div>
            <h1>Votre panier</h1>
            
            <br />
            <br />
            { affichage ?
                listepanier.map(produit=>(
                    <div className='panier-div' key={produit.uuid}>
                        <fieldset className='panier-fieldset'>
                            <p><b>{produit.nom}</b></p>
                            <p>{produit.prix}€</p>
                            <p>Quantite : <b>{produit.quantite}</b></p>
                            <button onClick={()=>{supprimePanierProduit(produit.id)}} className='btn-supp'>Supprimer</button>
                        </fieldset>
                    
                    </div>
                ))
                : <p> chargement ...</p>   
            }
           <br />
           <button onClick={()=>{supprimePanier();}} className='btn-ajoute'>Tout supprimer</button>
           <br />
           <br />
           {listepanier.length!=0 ?
                <button onClick={()=>{validePanier()}} className="btn-valide">Valider la commande</button>
                :
                <></>
           }
           <br />
           <br />
           <br />
           <br />

           { affichageHisto ?
                histo.map(produit=>(
                    <div className='histo-div' key={produit.id}>
                        <fieldset className='histo-fieldset'>
                            <p><b>{produit.nom}</b></p>
                            <p>{produit.prix}€</p>
                            <p>Quantite : <b>{produit.quantite}</b></p>
                            <p>date : <b>{produit.date}</b></p>
                        </fieldset>
                    
                    </div>
                ))
                : <p> chargement ...</p>   
            }
            <br />
            <br />

        </div>
    )
}
