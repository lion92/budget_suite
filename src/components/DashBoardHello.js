import React from 'react';
import './dashboard.scss'
import {NavLink} from "react-router-dom";
import './dash.scss'
import {RiLockPasswordLine, RiMoneyEuroCircleFill} from "react-icons/ri";
import {LuMailOpen} from "react-icons/lu";

const DashBoardHello = () => {

    return (
        <>
            <div className="sidebar">
                <div className="logo-details">

                    <div className="logo_name">Kriss CLOTILDE Budget</div>

                </div>
                <ul className="nav-list">


                    <NavLink to={"/"}>
                        <li>Bienvenue</li>
                    </NavLink>
                    <NavLink to={"/login"}>
                        <li>Login</li>
                    </NavLink>
                    <NavLink to={"/inscription"}>
                        <li>Inscription</li>
                    </NavLink>
                    <NavLink to={"/categorie"}>
                        <li>Categorie</li>
                    </NavLink>
                    <NavLink to={"/form"}>
                        <li>Tache</li>
                    </NavLink>
                    <NavLink to={"/budget"}>
                        <li>Budget</li>
                    </NavLink>
                </ul>

            </div>
            <section className="home-section">


                <div id="header">
                    <div className="header uboxed">
                        <ul className="logo">
                            <li>

                            </li>
                        </ul>
                        <ul className="menu">
                            <li></li>
                            <li></li>
                            <li>
                                <div id="lang">
                                    <div className="selected"></div>
                                    <div className="options">
                                        <a href="#"></a>
                                        <a href="#"></a>
                                        <a href="#"></a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>
                <div className="divCentrer">
                    <h1>Bienvenue dans l'application de gestion de budget.</h1>
                    <RiMoneyEuroCircleFill style={{fontSize:"5em", color:'blueviolet'}}/>
                    <p>Pour utliser l'outil veuillez vous inscrire et vous connecter avec votre mot de passe et
                        email.</p>
                    <div><LuMailOpen style={{fontSize: "5em", color: "blueviolet"}}/>
                        <RiLockPasswordLine style={{fontSize: "5em", color: "blueviolet"}}/></div>

                </div>


            </section>

        </>
    );
};

export default DashBoardHello;