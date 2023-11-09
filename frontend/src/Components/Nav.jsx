import React from 'react'
import './Nav.css'
import { Link } from 'react-router-dom';

export default function Nav() {
	return (
	<ul className='nav'>
		<h3>M2L</h3>
		<div className='sousnav'>
			<Link to='/'>Accueil</Link>
			<Link to='/produit'>Produits</Link>
			<Link to='/connexion'>Se connecter</Link>
			<Link to='/inscription'>S'inscrire</Link>
			<Link to='/panier'>Panier</Link>
		</div>
	</ul>
	)
}
