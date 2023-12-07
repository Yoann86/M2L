import React, {useEffect,useState} from 'react';
import axios from 'axios';
import './Produit.css' ;

async function AjoutePanierProduit(uuidProduit){
    const token = localStorage.getItem("token");
    const quantite = 1;
    const data = {
        uuidProduit,
        quantite
    };

    const axiosInstance = axios.create({
        baseURL: "http://localhost:3030",
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json', 
        },
    });

    const ajout = await axiosInstance.post("/produit/panier",JSON.stringify(data));

}

export default function Produit({ estConnecte }) {
    const [listeproduit, setListeProduit] = useState([]);
    const [affichage, setAffichage] = useState(false);
    const [categorie, setCategorie] = useState('');

    const recup = async ()=>{
        await axios.get("http://localhost:3030/produit")
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
            { affichage ?
                listeproduit.map(produit=>(
                    <div key={produit.uuid}>
                        <fieldset>
                            <p>{produit.nom}</p>
                            <p>{produit.description}</p>
                            <p>{produit.prix}€</p>
                            <p>Quantite : {produit.quantite}</p>
                        </fieldset>

                        { estConnecte ?
                            <button onClick={()=>{AjoutePanierProduit(produit.uuid)}} className='btn-ajoute'>Ajouter au Panier</button>
                            :
                            <></>
                        }
                        
                    </div>
                ))
                : <p> chargement ...</p>   
            }
        </div>
    )
}


{/* <div className='w'>
        <h1>Quiz</h1>
        <select onChange={(e) => setTheme(e.target.value)}>
            <option value="">Tous les thèmes</option>
            <option value="testaz">Testaz</option>
        </select>
        {affichage ? 
            quiz.map(question=>(
                (theme!="" && theme==question.theme)||(theme=="") ? 
                <div key={question.id}>
                    <fieldset>
                        <p>Id: {question.id}</p>
                        <p>Theme: {question.theme}</p>
                        <p>Question: {question.question}</p>
                        <p>Reponse: {question.reponse}</p>
                    </fieldset>
                    
                    <Link to={`/Modif/${question.id}`}>modifier</Link>  
                    <button className='sup' onClick={()=>{supprimer(question.id)}}>supprimer</button>
                </div>
                : <></>
                
            ))
            : <p> chargement ...</p>   
        }
    </div> */}