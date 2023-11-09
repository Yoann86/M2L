import { React, useState }from 'react'
import './Nav.css'
import { Link } from 'react-router-dom';

export default function Nav({ estConnecte,updateNavState }) {

	const handleDeconnexion = () => {
		updateNavState(false);
	  };

	return (
	<ul className='nav'>
		<h3>M2L</h3>
		<div className='sousnav'>
			<Link to='/'>Accueil</Link>
			<Link to='/produit'>Produits</Link>
			{ estConnecte==false ?
				<>
					<Link to='/connexion'>Se connecter</Link>
					<Link to='/inscription'>S'inscrire</Link>
				</>
			:
				<>
					<Link to='/panier'>Panier</Link>
					<Link onClick={handleDeconnexion} to='/'>Se déconnecter</Link>
				</>
			}
		</div>
	</ul>
	)
}
