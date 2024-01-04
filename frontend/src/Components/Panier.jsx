import React from 'react'
import {useEffect,useState} from 'react';
import axios from 'axios';

export default function Panier() {
    const [listepanier, setListePanier] = useState([]);
    const [affichage, setAffichage] = useState(false);
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
    },[]);

        return (
        <div>
            <h1>Votre panier</h1>
            <button onClick={()=>{supprimePanier();}} className='btn-ajoute'>Tout supprimer</button>
            <br />
            <br />
            { affichage ?
                listepanier.map(produit=>(
                    <div key={produit.uuid}>
                        <fieldset>
                            <p>{produit.nom}</p>
                            <p>{produit.description}</p>
                            <p>{produit.prix}€</p>
                            <p>Quantite : {produit.quantite}</p>
                        </fieldset>
                    <button onClick={()=>{supprimePanierProduit(produit.id)}} className='btn-supp'>Supprimer</button>
                    </div>
                ))
                : <p> chargement ...</p>   
            }
           <br />
           <br />
           {listepanier.length!=0 ?
                <button onClick={()=>{validePanier()}} className="btn-valide">Valider la commande</button>
                :
                <></>
           }

        </div>
    )
}
