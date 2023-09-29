import React from 'react';
import './dashboard.scss'
import Form from "./Form";
import {NavLink} from "react-router-dom";

const DashBoardTache = () => {

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
                <h1>Tache</h1>
              <Form></Form>

            </section>

        </>
    );
};

export default DashBoardTache;