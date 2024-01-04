import React from 'react'
import {useEffect,useState} from 'react';
import axios from 'axios';

export default function AjouteProduit() {
    const [nom, setNom] = useState('');
	const [description, setDescription] = useState('');
	const [prix, setPrix] = useState('');
	const [quantite, setQuantite] = useState('');
    const [msg, setMsg] = useState('');
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
            const response = await axiosInstance.post(`/dashboard/ajouterproduit`,JSON.stringify(data),
                {headers: {'Content-Type': 'application/json', },}
            );
            if (response.status === 200) {
                setMsg("Ajout réussi");
            }
		}
		catch(err){
			console.error('Erreur ajout',err);
			setMsg("Erreur ajout");
		}	
	};

    return (
        <div>
            <h1>Ajouter un produit</h1>
            <form onSubmit={handleFormSubmit} >
				<div>
					<label htmlFor="">Nom</label>
					<input 
						type="text" 
						name="nom" 
        
						onChange={(e)=>{setNom(e.target.value)}}
					/>
				</div>
				<div>
					<label htmlFor="">Description</label>
					<input 
						type="text" 
						name="description" 
						onChange={(e)=>{setDescription(e.target.value)}}
					/>
				</div>
				<div>
					<label htmlFor="">Prix</label>
					<input 
						type="text" 
						name="prix" 
						onChange={(e)=>{setPrix(e.target.value)}}
					/>
				</div>
				<div>
					<label htmlFor="">Quantite</label>
					<input 
						type="text" 
						name="quantite" 
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
