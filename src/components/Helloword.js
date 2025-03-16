import React from 'react';
import {useAppStore} from "../store";

const Helloword = () => {
    const {mois}=useAppStore()
    return (
        <div>
            <h1>Bienvenue dans l'application de gestion de budget.</h1>
            <div><a style={{color: "red"}} rel="kriss" href="https://projet.krissclotilde.com/" target="_blank">Qui suis
                je?</a></div>
            <iframe style={{height:'400px'}} width="560px" src="https://www.youtube.com/embed/-BccOu30360?si=sndME0Gl7qSUY-cg"
                    title="YouTube video player" frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
    );
};

export default Helloword;