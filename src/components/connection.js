import React, {useCallback, useEffect, useState} from 'react';
import Form from "./Form";
import lien from './lien'
import './css/dash.scss'

const Connection = () => {
    const [messageLog, setMessageLog] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [mailError, setEmailError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [probleme, setProbleme] = useState("non connecte");
    const [catcha, setCatcha] = useState("");
    const [catchaColler, setCatchaColler] = useState("");
    const [notification, setNotification] = useState({
        show: false,
        type: "error", // "error", "success", "warning", "info"
        message: "",
    });

    useEffect(() => {
        fetchUerToken();
    }, []);

    // Fonction pour afficher une notification
    const showNotification = (type, message) => {
        setNotification({
            show: true,
            type,
            message,
        });

        // Masquer la notification après 5 secondes
        setTimeout(() => {
            setNotification(prev => ({
                ...prev,
                show: false,
            }));
        }, 5000);
    };

    function catchaGenerate() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        function generateString(length) {
            let result = '';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

            return result;
        }

        setCatcha(generateString(7));
    }

    function ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return (true)
        }
        setEmailError("You have entered an invalid email address!")
        showNotification("error", "Adresse email invalide");
        return (false)
    }

    let fetchUerToken = useCallback(async () => {
        let str = "" + localStorage.getItem('jwt')
        if (!str || str === "null" || str === "undefined") {
            setMessageLog("Aucun token trouvé, veuillez vous connecter");
            return;
        }

        try {
            const response = await fetch(
                lien.url + "connection/user",
                {
                    method: "POST",
                    body: JSON.stringify({
                        jwt: str
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })

            // Vérifier si la réponse est OK
            if (!response.ok) {
                setMessageLog(`Erreur du serveur: ${response.status}`);
                showNotification("error", `Erreur du serveur: ${response.status}`);
                return;
            }

            // Lire le texte de la réponse
            const text = await response.text();

            // Vérifier si la réponse n'est pas vide
            if (!text) {
                setMessageLog("Le serveur a renvoyé une réponse vide");
                showNotification("error", "Le serveur a renvoyé une réponse vide");
                return;
            }

            // Essayer de parser le JSON
            let data;
            try {
                data = JSON.parse(text);
            } catch (error) {
                console.error("Réponse invalide du serveur:", text);
                setMessageLog("Réponse invalide du serveur");
                showNotification("error", "Réponse invalide du serveur");
                return;
            }

            if (!isNaN(data?.id)) {
                localStorage.setItem("utilisateur", data?.id);
                setMessageLog("Code Bon");
                setProbleme('connecte');
                showNotification("success", "Connexion réussie");
            } else {
                setMessageLog("Déconnecté - Token invalide");
                showNotification("warning", "Session expirée - Veuillez vous reconnecter");
            }
        } catch (error) {
            console.error("Erreur lors de la vérification du token:", error);
            setMessageLog("Erreur de connexion au serveur");
            showNotification("error", "Erreur de connexion au serveur");
        }
    }, []);

    let fetchConnection = useCallback(async (e) => {
        e.preventDefault();

        // Réinitialiser les messages d'erreur
        setPasswordError("");

        if (password.length < 3) {
            setPasswordError("Impossible : mot de passe trop court (minimum 3 caractères)");
            showNotification("error", "Mot de passe trop court (minimum 3 caractères)");
            return;
        }

        try {
            const response = await fetch(
                lien.url + "connection/login",
                {
                    method: "POST",
                    body: JSON.stringify({
                        "password": password,
                        "email": email
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

            // Vérifier si la réponse est OK
            if (!response.ok) {
                setMessageLog(`Erreur du serveur: ${response.status}`);
                showNotification("error", `Erreur du serveur: ${response.status}`);
                return;
            }

            // Lire le texte de la réponse
            const text = await response.text();

            // Vérifier si la réponse n'est pas vide
            if (!text) {
                setMessageLog("Le serveur a renvoyé une réponse vide");
                showNotification("error", "Le serveur a renvoyé une réponse vide");
                return;
            }

            // Essayer de parser le JSON
            let data;
            try {
                data = JSON.parse(text);
            } catch (error) {
                console.error("Réponse invalide du serveur:", text);
                setMessageLog("Réponse invalide du serveur");
                showNotification("error", "Réponse invalide du serveur");
                return;
            }

            // Vérifier si une erreur est renvoyée dans la réponse
            if (data.message && !data.success) {
                setMessageLog(data.message);

                // Vérifier si c'est une erreur de validation d'email
                if (data.message.includes("vérifier votre email")) {
                    showNotification("warning", "Veuillez vérifier votre email avant de vous connecter");
                } else {
                    showNotification("error", data.message);
                }
                return;
            }

            // Vérifier si le JWT est présent dans la réponse
            if (!data.jwt) {
                setMessageLog("Erreur de connexion : JWT manquant dans la réponse du serveur");
                showNotification("error", "Erreur d'authentification - JWT manquant");
                return;
            }

            if (!isNaN(data?.id)) {
                localStorage.setItem("utilisateur", data?.id);
                localStorage.setItem('jwt', data?.jwt);
                setMessageLog("Code Bon");
                setProbleme('connecte');
                showNotification("success", "Connexion réussie");
            } else {
                setMessageLog("Combinaison code et mot de passe incorrecte");
                showNotification("error", "Identifiants incorrects");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
            setMessageLog("Erreur de connexion au serveur");
            showNotification("error", "Erreur de connexion au serveur");
        }
    }, [email, password]);

    // Pour déconnecter l'utilisateur
    const handleLogout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('utilisateur');
        setProbleme('non connecte');
        setEmail('');
        setPassword('');
        setCatchaColler('');
        setCatcha('');
        showNotification("info", "Vous avez été déconnecté");
    };

    return (
        <div>
            {/* Composant de notification */}
            {notification.show && (
                <div className={`notification ${notification.type}`}>
                    <div className="notification-content">
                        <span className="notification-message">{notification.message}</span>
                        <button
                            className="notification-close"
                            onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}

            {(probleme === "connecte") ? (
                <div>
                    <Form />
                    <button onClick={handleLogout} className="logout-button">
                        Déconnexion
                    </button>
                </div>
            ) : (
                <div>
                    <div className="container2">
                        <div className="status-indicator">{"" + probleme}</div>

                        <div id="iconLogin"/>

                        <input id='email' value={email} placeholder={'email'} onChange={e => {
                            setEmail(e.target.value);
                            if (ValidateEmail(email)) {
                                setEmailError("");
                            }
                        }}
                               type={'text'}/>
                        <p className="error">{mailError}</p>

                        <input id='password' value={password} placeholder={'password'}
                               onChange={e => {
                                   setPassword(e.target.value);
                                   if (e.target.value.length < 3) {
                                       setPasswordError("Le mot de passe doit être d'au moins 3 caractères");
                                   } else {
                                       setPasswordError("");
                                   }
                               }} type={'password'}/>
                        <p className="error">{passwordError}</p>

                        <button onClick={catchaGenerate}>Générer Captcha</button>

                        <h2 id="blur">{catcha}</h2>
                        <h2>Saisir le captcha</h2>
                        <input value={catchaColler} placeholder={'captcha'} onChange={e => {
                            setCatchaColler(e.target.value);

                            if ("" + e.target.value !== "" + catcha) {
                                setPasswordError("Le captcha n'est pas correct");
                            } else {
                                setPasswordError("Le captcha est correct");
                            }
                        }} type={'text'}/>

                        {passwordError === "Le captcha est correct" ?
                            <button onClick={fetchConnection} id='btnLogin'>LOGIN</button> : ""
                        }
                    </div>
                </div>
            )}

            {/* CSS pour les notifications */}
            <style jsx>{`
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    max-width: 350px;
                    padding: 15px;
                    border-radius: 4px;
                    animation: slideIn 0.5s forwards;
                    z-index: 1000;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    margin-left: 10px;
                }

                .notification.error {
                    background-color: #f44336;
                    color: white;
                }

                .notification.success {
                    background-color: #4CAF50;
                    color: white;
                }

                .notification.warning {
                    background-color: #ff9800;
                    color: white;
                }

                .notification.info {
                    background-color: #2196F3;
                    color: white;
                }

                .logout-button {
                    margin-top: 20px;
                    padding: 8px 16px;
                    background-color: #f44336;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .logout-button:hover {
                    background-color: #d32f2f;
                }
            `}</style>
        </div>
    );
};

export default Connection;