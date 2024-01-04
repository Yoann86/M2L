import React from 'react'
import {useEffect,useState} from 'react';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';

export default function ModifProduit() {
    const [nom, setNom] = useState('');
	const [description, setDescription] = useState('');
	const [prix, setPrix] = useState('');
	const [quantite, setQuantite] = useState('');
    const [msg, setMsg] = useState('');
    const [produit, setProduit] = useState([]);
    const token = localStorage.getItem("token");
	// const [visibilite, setVisibilite] = useState('');
	// const navigate = useNavigate();

    const axiosInstance = axios.create({
        baseURL: "http://localhost:3030",
        headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json', 
        },
    });

    const recup = async ()=>{
        try {
            const res = await axiosInstance.get(`/panier/${token}`);
            const produitData = res.data[0];
            setProduit(produitData);
            setNom(produitData.nom);
            setDescription(produitData.description);
            setPrix(produitData.prix);
            setQuantite(produitData.quantite);

        } catch (error) {
            console.error('Erreur de récupération des données :', error);
        }
    }

    useEffect(()=>{
        recup();
    },[]);

	const handleFormSubmit = async (e) => {
		e.preventDefault();

		if (!nom || !description || !prix || !quantite) {
			setMsg("Veuillez remplir tous les champs.");
			return; 
		}

		const data = {
			nom,
			description,
			prix,
			quantite
		};

		try {
            const response = await axiosInstance.put(`/dashboard/modifierproduit`,JSON.stringify(data),
                {headers: {'Content-Type': 'application/json', },}
            );
            if (response.status === 200) {
                setMsg("Modif réussie");
            }
		}
		catch(err){
			console.error('Erreur modfi',err);
			setMsg("Erreur modif");
		}	
	};


    return (
        <div>
            <h1>Modifier le produit</h1>
            <form onSubmit={handleFormSubmit} >
				<div>
					<label htmlFor="">Nom</label>
					<input 
						type="text" 
						name="nom" 
                        defaultValue={produit["nom"]}
						onChange={(e)=>{setNom(e.target.value)}}
					/>
				</div>
				<div>
					<label htmlFor="">Description</label>
					<input 
						type="text"
						name="description" 
                        defaultValue={produit["description"]}
						onChange={(e)=>{setDescription(e.target.value);}}
					/>
				</div>
				<div>
					<label htmlFor="">Prix</label>
					<input 
						type="text" 
						name="prix" 
                        defaultValue={produit["prix"]}
						onChange={(e)=>{setPrix(e.target.value)}}
					/>
				</div>
				<div>
					<label htmlFor="">Quantite</label>
					<input 
						type="text" 
						name="quantite" 
                        defaultValue={produit["quantite"]}
						onChange={(e)=>{setQuantite(e.target.value)}}
					/>
				</div>
				<div>
					<input type="submit" 
						value="Valider"
					/>
				</div>
			</form>
			{ msg!="" ?
				<div>{msg}</div>
				:
				<></>
			}
        </div>
    )

}
