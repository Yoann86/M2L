import React from 'react';
import {useEffect,useState} from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';

export default function Connexion() {
	const [email, setEmail] = useState('');
	const [mdp, setMdp] = useState('');
	const [msg, setMsg] = useState('');
	const navigate = useNavigate();

	const handleFormSubmit = async (e) => {
		e.preventDefault();

		if (!email || !mdp) {
			setMsg("Veuillez remplir tous les champs.");
			return; 
		}

		const data = {
			email,
			mdp
		};
		
		try {
			const response = await axios.post(`http://localhost:3030/connexion/`,JSON.stringify(data),
				{headers: {'Content-Type': 'application/json', },}
			);

			if (response.status === 200) {
				const rd = response.data;
				localStorage.setItem("email",rd.user["email"]);
				localStorage.setItem("prenom",rd.user["prenom"]);
				localStorage.setItem("nom",rd.user["nom"]);
				setMsg("Connexion effecutée");
			}
		} 
		catch (error) {
			console.error('Erreur lors de la connexion',error);
			setMsg("Erreur, les informations de connexion sont erronées");
		}
	};

	return (
		<div>
			<form onSubmit={handleFormSubmit} >
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
						value="Se connecter"
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
