import Nav from './Components/Nav'
import Accueil from './Components/Accueil';
import Connexion from './Components/Connexion';
import Inscription from './Components/Inscription';
import Panier from './Components/Panier.jsx';
import Produit from './Components/Produit.jsx';
import Dashboard from './Components/Dashboard.jsx';
import {Routes, Route } from "react-router-dom";
import axios from 'axios';
import './App.css';
import { useState,useEffect } from 'react';

function App() {
	const [estConnecte,setEstConnecte] = useState(localStorage.getItem("token")!=null);
	const [estAdmin, setEstAdmin] = useState(false);

	useEffect(() => {
		const testAdmin = async () => {
		  const token = localStorage.getItem('token');
	
		  if (token) {
			const axiosInstance = axios.create({
			  baseURL: 'http://localhost:3030',
			  headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			  },
			});
	
			try {
			  const response = await axiosInstance.get(`/autorisation/${token}`);
			  if (response.status === 200) {
				console.log(response.data);
				setEstAdmin(response.data); 
			  }
			} catch (error) {
			  console.error(error);
			}
		  }
		};
	
		testAdmin();
	  }, [estConnecte]);

	const updateNavState = (connecte) => {
		setEstConnecte(connecte);	
		if (connecte==false){
			localStorage.clear();
		}
	};

	return (
		<div className='app'>
		<Nav estConnecte={estConnecte} estAdmin={estAdmin} updateNavState={updateNavState} setEstAdmin={setEstAdmin}></Nav>
		<Routes>
			<Route path="/" element={<Accueil></Accueil>}></Route>
			<Route path="/connexion" element={<Connexion updateNavState={updateNavState}></Connexion>}></Route>
			<Route path="/inscription" element={<Inscription></Inscription>}></Route>
			<Route path="/panier" element={<Panier></Panier>}></Route>
			<Route path="/produit" element={<Produit estConnecte={estConnecte}></Produit>}></Route>
			<Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
		</Routes>
		</div>
	)
}

export default App
