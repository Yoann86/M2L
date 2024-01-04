import React, {useEffect,useState} from 'react';
import axios from 'axios';
import './Produit.css' ;

async function AjoutePanierProduit(uuid) {
    const token = localStorage.getItem("token");
  
    const axiosInstance = axios.create({
      baseURL: "http://localhost:3030",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    try {
      const response = await axiosInstance.post('/produit/panier', { uuidProduit: uuid, quantite: 1 }); // Inclure l'UUID dans le corps de la requête
      if (response.status === 200) {
        console.log("Ajout au panier réussi");
        // Mettez à jour ou récupérez les données appropriées après l'ajout au panier
        // recupProduit();
      }
    } catch (err) {
      console.error('Erreur lors de l\'ajout au panier', err);
    }
  }

export default function Produit({ estConnecte }) {
    const [listeproduit, setListeProduit] = useState([]);
    const [affichage, setAffichage] = useState(false);

    const recup = async () => {
        try {
            const res = await axios.get("http://localhost:3030/produit");
            setListeProduit(res.data);
            setAffichage(true);
        } catch (error) {
            console.error("Erreur lors de la récupération des produits :", error);
        }
    };

    useEffect(() => {
        recup();
    }, []);

    return (
        <div>
            <h1>Liste des produits</h1>
            {affichage ? (
                listeproduit.map(produit => (
                    produit.quantite>0 ?
                    <div key={produit.uuid}>
                        <fieldset>
                            {produit.image ? ( // Vérifiez si l'image existe pour ce produit
                                <img src={`http://localhost:3030/${produit.image}`} alt="" />
                            ) : (
                                <p>Pas d'image disponible</p>
                            )}
                            <p>{produit.nom}</p>
                            <p>{produit.description}</p>
                            <p>{produit.prix}€</p>
                            <p>Quantite : {produit.quantite}</p>
                        </fieldset>

                        {estConnecte ? (
                            <button onClick={() => { AjoutePanierProduit(produit.uuid) }} className='btn-ajoute'>Ajouter au Panier</button>
                        ) : (
                            <></>
                        )}
                        <br /><br />
                    </div>
                    :
                    <></>
                ))
            ) : (
                <p>Chargement...</p>
            )}
        </div>
    )
}

