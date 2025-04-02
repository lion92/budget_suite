import React, {useCallback, useState} from 'react';
import lien from './lien'

const Inscription = () => {
    const [email, setEmail] = useState("");
    const [inscriptionMessage, setInscriptionMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [password, setPassword] = useState("");
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [prenomError, setPrenomError] = useState("");
    const [nomError, setNomError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function validateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            setEmailError("");
            return true;
        }
        setEmailError("Vous avez entré une adresse email invalide!");
        return false;
    }

    const validateForm = () => {
        let isValid = true;

        // Validation du nom
        if (nom === "") {
            setNomError("Le nom est obligatoire");
            isValid = false;
        } else {
            setNomError("");
        }

        // Validation du prénom
        if (prenom === "") {
            setPrenomError("Le prénom est obligatoire");
            isValid = false;
        } else {
            setPrenomError("");
        }

        // Validation de l'email
        if (!validateEmail(email)) {
            isValid = false;
        }

        // Validation du mot de passe
        if (password.length < 3) {
            setPasswordError("Le mot de passe doit comporter au moins 3 caractères");
            isValid = false;
        } else {
            setPasswordError("");
        }

        return isValid;
    };

    let fetchInscription = useCallback(async (e) => {
        e.preventDefault();

        // Réinitialisation des messages
        setInscriptionMessage("");
        setIsSuccess(false);

        // Validation du formulaire
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                lien.url + "connection/signup",
                {
                    method: "POST",
                    body: JSON.stringify(
                        {
                            "nom": nom,
                            "prenom": prenom,
                            "password": password,
                            "email": email
                        }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                setIsSuccess(true);
                setInscriptionMessage("Inscription réussie! Un email de vérification a été envoyé à votre adresse email. Veuillez vérifier votre boîte de réception et suivre les instructions pour activer votre compte.");

                // Réinitialisation du formulaire
                setNom("");
                setPrenom("");
                setEmail("");
                setPassword("");
            } else {
                const data = await response.json().catch(() => ({}));
                setIsSuccess(false);
                setInscriptionMessage(data.message || "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
            }
        } catch (error) {
            setIsSuccess(false);
            setInscriptionMessage("Erreur de connexion au serveur. Veuillez réessayer plus tard.");
            console.error("Erreur d'inscription:", error);
        } finally {
            setIsLoading(false);
        }
    }, [nom, prenom, email, password]);

    return (
        <div className="containerInscription">
            <div className="container2">
                <h2>Inscription</h2>
                <div id="iconLogin"/>

                <div>
                    <input id='nom' value={nom} placeholder={'Nom'}
                           onChange={e => {
                               setNom(e.target.value);
                               if (e.target.value === "") {
                                   setNomError("Le nom est obligatoire");
                               } else {
                                   setNomError("");
                               }
                           }} type={'text'}/>
                    <p className="error">{nomError}</p>
                </div>

                <div>
                    <input id='prenom' value={prenom} placeholder={'Prénom'}
                           onChange={e => {
                               setPrenom(e.target.value);
                               if (e.target.value === "") {
                                   setPrenomError("Le prénom est obligatoire");
                               } else {
                                   setPrenomError("");
                               }
                           }} type={'text'}/>
                    <p className="error">{prenomError}</p>
                </div>

                <div>
                    <input id='email' value={email} placeholder={'Email'}
                           onChange={e => {
                               setEmail(e.target.value);
                               if (e.target.value !== "") {
                                   validateEmail(e.target.value);
                               }
                           }}
                           type={'text'}/>
                    <p className="error">{emailError}</p>
                </div>

                <div>
                    <input id='password' value={password} placeholder={'Mot de passe'}
                           onChange={e => {
                               setPassword(e.target.value);
                               if (e.target.value.length < 3) {
                                   setPasswordError("Le mot de passe doit comporter au moins 3 caractères");
                               } else {
                                   setPasswordError("");
                               }
                           }} type={'password'}/>
                    <p className="error">{passwordError}</p>
                </div>

                {inscriptionMessage && (
                    <p className={isSuccess ? "success-message" : "error"}>
                        {inscriptionMessage}
                    </p>
                )}

                <div className="info-message">
                    <p>Un email de validation vous sera envoyé après l'inscription pour activer votre compte.</p>
                </div>

                <button
                    onClick={fetchInscription}
                    disabled={isLoading}
                    className={isLoading ? "button-loading" : ""}
                >
                    {isLoading ? "Inscription en cours..." : "S'inscrire"}
                </button>
            </div>
        </div>
    );
};

export default Inscription;