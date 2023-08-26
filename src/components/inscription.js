import React, {useCallback, useState} from 'react';
import Navigation from "./Navigation";
import lien from './lien'
const Inscription = () => {
    const [email, setEmail] = useState("");
    const [inscriptionError, setInscriptionError] = useState("");
    const [password, setPassword] = useState("");
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [age, setAge] = useState("");
    const [prenomError, setPrenomError] = useState("");
    const [nomError, setNomError] = useState("");
    const [ageError, setAgeError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");

    function validateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
           setEmailError("")
            return (true)
        }
        setEmailError("You have entered an invalid email address!")
        return (false)
    }

    let fetchInscription = useCallback(async (e) => {
        e.preventDefault();
        if (nom === "") {
            setNomError("le nom est vide")
            return
        }
        if (prenom === "") {
            setPrenomError("Le prenom est vide")
            return
        }

        if (age===""||isNaN(age)) {
            setAgeError("Age doit être un nombre")
            return
        }
        if(!validateEmail(email)){
            return
        }

        if (passwordError.length > 3) {
            setPasswordError("Le password doit comporter au moins 3 caracteres")
            return
        }

        const response = await fetch(
            lien.url+"connection/signup",
            {
                method: "POST",
                body: JSON.stringify(
                    {
                        "nom": nom,
                        "prenom": prenom,
                        "age": age,
                        "password": password,
                        "email": email
                    },),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        if(response.ok){
            setInscriptionError("Inscription ok")
        }else
        {
            setPasswordError("une erreur s'est produite");
        }
    });

    return (

        <div>
            <div>
                <Navigation></Navigation>
                <div id="iconLogin"/>
                <form>
                <div>
                    <input id='nom' value={nom} placeholder={'nom'}
                           onChange={e => {
                               setNom(e.target.value);
                               if (e.target.value === "") {
                                   setNomError("le nom est vide")

                               } else {
                                   setNomError("");
                               }
                           }} type={'text'}/>
                    <p className="error">{nomError}</p>
                </div>
                <div>
                    <input id='prenom' value={prenom} placeholder={'prenom'}
                           onChange={e => {
                               setPrenom(e.target.value)
                               if (e.target.value === "") {
                                   setPrenomError("Le prenom est vide")
                               } else {
                                   setPrenomError("")
                               }
                           }} type={'text'}/>
                    <p className="error">{prenomError}</p>
                </div>
                <div>
                    <input id='age' value={age} placeholder={'age'}
                           onChange={e => {
                               setAge(e.target.value);
                               if (isNaN("" + e.target.value)) {
                                   setAgeError("Age doit être un nombre")

                               } else {
                                   setAgeError("");
                               }
                           }} type={'text'}/>
                    <p className="error">{ageError}</p>

                </div>
                <div>
                    <input id='email' value={email} placeholder={'email'} onChange={e => {
                        setEmail(e.target.value)
                        validateEmail(email)
                    }}
                           type={'text'}/>
                    <p className="error">{emailError}</p>
                </div>
                <div>
                    <input id='password' value={password} placeholder={'password'}
                           onChange={e => {
                               setPassword(e.target.value)
                               if (e.target.value.length < 3) {
                                   setPasswordError("Le password doit comporter au moins 3 caracteres")

                               } else {
                                   setPasswordError("");
                               }
                           }} type={'text'}/>
                    <p className="error">{passwordError}</p>
                </div>
                <p className="error">{inscriptionError}</p>
                <button onClick={fetchInscription} id='btnSignup'>SIGNUP</button>
                </form>
                </div>
        </div>
    );
};

export default Inscription;