import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

// Créez le contexte global pour l'API
export const ApiContext = React.createContext();

// Définissez votre URL de base et vos routes API
const baseURL = 'http://localhost:3030';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <ApiContext.Provider value={{ baseURL }}>
            <App />
        </ApiContext.Provider> 
    </BrowserRouter>
);
