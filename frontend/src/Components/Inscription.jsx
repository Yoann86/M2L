import React from 'react';
import {useEffect,useState} from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';

export default function Inscription() {
	const [nom, setNom] = useState('');
	const [prenom, setPrenom] = useState('');
	const [email, setEmail] = useState('');
	const [mdp, setMdp] = useState('');
	const [msg, setMsg] = useState('');
	const navigate = useNavigate();

	const handleFormSubmit = async (e) => {
		e.preventDefault();

		if (!prenom || !nom || !email || !mdp) {
			setMsg("Veuillez remplir tous les champs.");
			return; 
		}

		const data = {
			prenom,
			nom,
			email,
			mdp
		};

		try {
			const testmail = await axios.post(`http://localhost:3030/inscription/mail`,JSON.stringify(data), //
				{headers: {'Content-Type': 'application/json', },}
			)
			if (testmail.status === 200) {
				try {
					const response = await axios.post(`http://localhost:3030/inscription/`,JSON.stringify(data),
						{headers: {'Content-Type': 'application/json', },}
					);
					if (response.status === 200) {
						setMsg("Inscription réussie");
					}
				} 
				catch (error) {
					console.error('Erreur lors de l"inscription :',error);
				}
			}
		}
		catch(err){
			console.error('Mail en doublon',err);
			setMsg("Mail en doublon");
		}	
	};

	return (
		<div>
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
					<label htmlFor="">Prénom</label>
					<input 
						type="text" 
						name="prenom" 
						onChange={(e)=>{setPrenom(e.target.value)}}
					/>
				</div>
				<div>
					<label htmlFor="">E-mail</label>
					<input 
						type="text" 
						name="email" 
						onChange={(e)=>{setEmail(e.target.value)}}
					/>
				</div>
				<div>
					<label htmlFor="">Mdp</label>
					<input 
						type="password" 
						name="mdp" 
						onChange={(e)=>{setMdp(e.target.value)}}
					/>
				</div>
				<div>
					<input type="submit" 
						value="S'inscrire"
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
