import Nav from './Components/Nav'
import Accueil from './Components/Accueil';
import Connexion from './Components/Connexion';
import Inscription from './Components/Inscription';
import Panier from './Components/Panier.jsx';
import Produit from './Components/Produit.jsx';
import {Routes, Route } from "react-router-dom";
import './App.css';

function App() {
	return (
		<div className='app'>
		<Nav></Nav>
		<Routes>
			<Route path="/" element={<Accueil></Accueil>}></Route>
			<Route path="/connexion" element={<Connexion></Connexion>}></Route>
			<Route path="/inscription" element={<Inscription></Inscription>}></Route>
			<Route path="/panier" element={<Panier></Panier>}></Route>
			<Route path="/produit" element={<Produit></Produit>}></Route>
		</Routes>
		</div>
	)
}

export default App
