import React from 'react';
import {useEffect,useState} from 'react';
import axios from 'axios';

export default function Dashboard() {
    const [listeproduit, setListeProduit] = useState([]);
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
        await axiosInstance.get(`/dashboard/produits`)
            .then( res => {
                setListeProduit(res.data);
                setAffichage(true);
            })
    }

    useEffect(()=>{
        recup();
    },[]);

    return (
        <div>
            <h1>Liste des produits</h1>
            <br />
            <br />
            { affichage ?
                listeproduit.map(produit=>(
                    <div key={produit.uuid}>
                        <fieldset>
                            <p>{produit.nom} - {produit.description} - {produit.prix}€ - {produit.quantite} - {produit.visibilite}</p>  
                        </fieldset>
                    {/* <button onClick={()=>{supprimePanierProduit(produit.id)}} className='btn-supp'>Supprimer</button> */}
                    </div>
                ))
                : <p> chargement ...</p>   
            }
            <br />
            <br />
           
            <button onClick={()=>{ajouterProduit()}} className="btn-ajoute">Ajouter un produit</button>
        </div>
    )

}
