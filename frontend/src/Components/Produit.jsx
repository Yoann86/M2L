import React, {useEffect,useState} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';

export default function Produit() {
    const [produit, setProduit] = useState([]);
    const [affichage, setAffichage] = useState(false);
    const [categorie, setCategorie] = useState('');

    const recup = async ()=>{
        await axios.get("http://localhost:3030/question")
            .then( res => {
                setProduit(res.data);
                setAffichage(true);
            })
    }

    useEffect(()=>{
        recup();
    },[]);

    return (
        <div>
            
            
        
        </div>
    )
}


{/* <div className='w'>
        <h1>Quiz</h1>
        <select onChange={(e) => setTheme(e.target.value)}>
            <option value="">Tous les thèmes</option>
            <option value="testaz">Testaz</option>
        </select>
        {affichage ? 
            quiz.map(question=>(
                (theme!="" && theme==question.theme)||(theme=="") ? 
                <div key={question.id}>
                    <fieldset>
                        <p>Id: {question.id}</p>
                        <p>Theme: {question.theme}</p>
                        <p>Question: {question.question}</p>
                        <p>Reponse: {question.reponse}</p>
                    </fieldset>
                    
                    <Link to={`/Modif/${question.id}`}>modifier</Link>  
                    <button className='sup' onClick={()=>{supprimer(question.id)}}>supprimer</button>
                </div>
                : <></>
                
            ))
            : <p> chargement ...</p>   
        }
    </div> */}