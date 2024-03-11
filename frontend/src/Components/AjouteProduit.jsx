import React from 'react'
import {useEffect,useState} from 'react';
import axios from 'axios';

export default function AjouteProduit() {
    const [nom, setNom] = useState('');
	const [description, setDescription] = useState('');
	const [prix, setPrix] = useState('');
	const [quantite, setQuantite] = useState('');
    const [image, setImage] = useState(null);
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

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
    };

	const handleFormSubmit = async (e) => {
        e.preventDefault();
    
        if (!nom || !description || !prix || !quantite || !image) {
            setMsg("Veuillez remplir tous les champs.");
            return; 
        }
    
        const formData = new FormData();
        formData.append('nom', nom);
        formData.append('description', description);
        formData.append('prix', prix);
        formData.append('quantite', quantite);
        formData.append("image", image); // Ajoutez ici votre image dans le FormData
    
        try {
            const response = await axiosInstance.post('/dashboard/ajouterproduit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Assurez-vous d'utiliser 'multipart/form-data'
                },
            });
    
            if (response.status === 200) {
                setMsg("Ajout réussi");
            }
        } catch (err) {
            console.error('Erreur ajout', err);
            setMsg("Erreur ajout");
        }	
    };

    return (
        <div>
            <div className='barre'>
                a
            </div>
            <h1>Ajouter un produit</h1>
            <form encType="multipart/form-data" onSubmit={handleFormSubmit} >
				<div className='bloc-form'>
					<label htmlFor="">Nom</label>
					<input 
						type="text" 
						name="nom" 
						onChange={(e)=>{setNom(e.target.value)}}
					/>
				</div>
				<div className='bloc-form'>
					<label htmlFor="">Description</label>
					<input 
						type="text" 
						name="description" 
						onChange={(e)=>{setDescription(e.target.value)}}
					/>
				</div>
				<div className='bloc-form'>
					<label htmlFor="">Prix</label>
					<input 
						type="text" 
						name="prix" 
						onChange={(e)=>{setPrix(e.target.value)}}
					/>
				</div>
				<div className='bloc-form'>
					<label htmlFor="">Quantite</label>
					<input 
						type="text" 
						name="quantite" 
						onChange={(e)=>{setQuantite(e.target.value)}}
					/>
				</div>
                <div className='bloc-form'>
                    <label htmlFor="">Image</label>
                    <input 
                        type="file" 
                        accept="image/*" // Permet seulement les fichiers image
                        onChange={handleImageChange} // Appel à la fonction pour gérer le changement de l'image
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
