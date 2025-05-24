import React, {useCallback, useEffect, useState} from 'react';
import lien from './lien';
import './css/dash.scss';
import {Budget} from "./Budget";
import './css/connexion.css'

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
        type: "error",
        message: "",
    });

    useEffect(() => {
        fetchUserToken();
    }, []);

    const showNotification = (type, message) => {
        setNotification({show: true, type, message});
        setTimeout(() => {
            setNotification(prev => ({...prev, show: false}));
        }, 5000);
    };

    const catchaGenerate = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const result = Array.from({length: 7}, () => characters[Math.floor(Math.random() * characters.length)]).join('');
        setCatcha(result);
    };

    const ValidateEmail = (mail) => {
        const valid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
        if (!valid) {
            setEmailError("Adresse email invalide");
            showNotification("error", "Adresse email invalide");
        } else {
            setEmailError("");
        }
        return valid;
    };

    const fetchUserToken = useCallback(async () => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt || jwt === "null" || jwt === "undefined") {
            setMessageLog("Aucun token trouvé, veuillez vous connecter");
            return;
        }

        try {
            const response = await fetch(`${lien.url}connection/user`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({jwt})
            });

            if (!response.ok) {
                setMessageLog(`Erreur du serveur: ${response.status}`);
                showNotification("error", `Erreur du serveur: ${response.status}`);
                return;
            }

            const text = await response.text();
            if (!text) {
                setMessageLog("Réponse vide du serveur");
                showNotification("error", "Réponse vide du serveur");
                return;
            }

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                setMessageLog("Réponse invalide du serveur");
                showNotification("error", "Réponse invalide du serveur");
                return;
            }

            if (!isNaN(data?.id)) {
                localStorage.setItem("utilisateur", data.id);
                setMessageLog("Code Bon");
                setProbleme("connecte");
                showNotification("success", "Connexion réussie");
            } else {
                setMessageLog("Déconnecté - Token invalide");
                showNotification("warning", "Session expirée - Veuillez vous reconnecter");
            }
        } catch (err) {
            setMessageLog("Erreur de connexion au serveur");
            showNotification("error", "Erreur de connexion au serveur");
        }
    }, []);

    const fetchConnection = useCallback(async (e) => {
        e.preventDefault();
        setPasswordError("");

        if (password.length < 3) {
            setPasswordError("Mot de passe trop court");
            showNotification("error", "Mot de passe trop court");
            return;
        }

        try {
            const response = await fetch(`${lien.url}connection/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password})
            });

            if (!response.ok) {
                setMessageLog(`Erreur serveur: ${response.status}`);
                showNotification("error", `Erreur serveur: ${response.status}`);
                return;
            }

            const text = await response.text();
            if (!text) {
                setMessageLog("Réponse vide du serveur");
                showNotification("error", "Réponse vide du serveur");
                return;
            }

            let data;
            try {
                data = JSON.parse(text);
            } catch {
                setMessageLog("Réponse invalide");
                showNotification("error", "Réponse invalide du serveur");
                return;
            }

            if (data.message && !data.success) {
                setMessageLog(data.message);
                showNotification(data.message.includes("email") ? "warning" : "error", data.message);
                return;
            }

            if (!data.jwt) {
                setMessageLog("JWT manquant dans la réponse");
                showNotification("error", "JWT manquant dans la réponse");
                return;
            }

            if (!isNaN(data?.id)) {
                localStorage.setItem("utilisateur", data.id);
                localStorage.setItem("jwt", data.jwt);
                setMessageLog("Connexion réussie");
                setProbleme("connecte");
                showNotification("success", "Connexion réussie");

                // 🔁 Rafraîchissement pour mise à jour du menu
                window.location.reload();
            } else {
                setMessageLog("Identifiants incorrects");
                showNotification("error", "Identifiants incorrects");
            }
        } catch (err) {
            setMessageLog("Erreur de connexion");
            showNotification("error", "Erreur de connexion au serveur");
        }
    }, [email, password]);

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("utilisateur");
        setProbleme("non connecte");
        setEmail("");
        setPassword("");
        setCatcha("");
        setCatchaColler("");
        showNotification("info", "Déconnecté");
    };

    return (
        <div>
            {notification.show && (
                <div className={`notification ${notification.type}`}>
                    <div className="notification-content">
                        <span>{notification.message}</span>
                        <button onClick={() => setNotification(prev => ({...prev, show: false}))}>&times;</button>
                    </div>
                </div>
            )}

            {probleme === "connecte" ? (
                <div>
                    <button onClick={handleLogout} className="logout-button">Déconnexion</button>
                    <Budget/>
                </div>
            ) : (
                <div className="container2">
                    <div className="status-indicator">{messageLog || probleme}</div>
                    <input
                        id="email"
                        value={email}
                        placeholder="email"
                        onChange={e => {
                            setEmail(e.target.value);
                            ValidateEmail(e.target.value);
                        }}
                        type="text"
                    />
                    <p className="error">{mailError}</p>

                    <input
                        id="password"
                        value={password}
                        placeholder="password"
                        onChange={e => {
                            setPassword(e.target.value);
                            setPasswordError(e.target.value.length < 3 ? "Mot de passe trop court" : "");
                        }}
                        type="password"
                    />
                    <p className="error">{passwordError}</p>

                    <button onClick={catchaGenerate}>Générer Captcha</button>
                    <h2 id="blur">{catcha}</h2>
                    <h2>Saisir le captcha</h2>
                    <input
                        value={catchaColler}
                        placeholder="captcha"
                        onChange={e => {
                            setCatchaColler(e.target.value);
                            setPasswordError(e.target.value === catcha ? "Le captcha est correct" : "Le captcha n'est pas correct");
                        }}
                        type="text"
                    />

                    {passwordError === "Le captcha est correct" && (
                        <button onClick={fetchConnection} id="btnLogin">LOGIN</button>
                    )}
                </div>
            )}
            <style jsx>{`
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    max-width: 90%;
                    width: 350px;
                    padding: 1rem;
                    border-radius: 6px;
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
                    gap: 1rem;
                }

                .notification-close {
                    background: none;
                    border: none;
                    font-size: 20px;
                    color: white;
                    cursor: pointer;
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
                    margin: 2rem auto 0;
                    padding: 0.75rem 1.5rem;
                    background-color: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    display: block;
                    width: 90%;
                    max-width: 300px;
                    transition: background-color 0.3s ease;
                }

                .logout-button:hover {
                    background-color: #c0392b;
                }

                .container2 {
                    width: 90%;
                    max-width: 400px;
                    margin: 3rem auto;
                    padding: 2rem;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                }

                .status-indicator {
                    font-weight: bold;
                    color: #5D3A9B;
                    text-align: center;
                    font-size: 1.1rem;
                    text-transform: uppercase;
                }

                input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    font-size: 1rem;
                    border-radius: 10px;
                    border: 1px solid #ccc;
                }

                input:focus {
                    border-color: #3778c2;
                    outline: none;
                    box-shadow: 0 0 0 2px rgba(55, 120, 194, 0.2);
                }

                .error {
                    color: red;
                    font-size: 0.875rem;
                    align-self: flex-start;
                }

                button {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    font-size: 1rem;
                    font-weight: bold;
                    border: none;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #3778c2, #4facfe);
                    color: white;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }

                button:hover {
                    background: linear-gradient(135deg, #2b5a9e, #3a8efc);
                }

                #blur {
                    filter: blur(1px);
                    letter-spacing: 3px;
                    user-select: none;
                    background: #f0f0f0;
                    padding: 10px;
                    border-radius: 6px;
                    font-weight: bold;
                    font-size: 1.3rem;
                    text-align: center;
                    width: 100%;
                }

                @media (max-width: 480px) {
                    .container2 {
                        padding: 1.5rem;
                        gap: 0.75rem;
                    }

                    input,
                    button {
                        font-size: 0.95rem;
                    }

                    #blur {
                        font-size: 1.1rem;
                    }
                }
            `}</style>

        </div>
    );
};

export default Connection;
