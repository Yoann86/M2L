import React from 'react'
import './Accueil.css'
import imageSrc from '../assets/image.jpg'

export default function Accueil() {
	return (
	<div>
		<div className='barre'>
			a
		</div>
		<h2>Bienvenue sur le site de la Maison des Ligues</h2>
		<img src={imageSrc} alt="" />
	</div>
	)
}
