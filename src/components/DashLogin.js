import React from 'react';
import './dashboard.scss'
import Navigation from "./Navigation";
import Connection from "./connection";
import {NavLink} from "react-router-dom";
import Budget from "./Budget";

const DashBoardLogin = () => {

    return (
        <>
            <div className="sidebar">
                <div className="logo-details">
                    <i className='bx bxl-c-plus-plus icon'></i>
                    <div className="logo_name">CodingLab</div>
                    <i className='bx bx-menu' id="btn"></i>
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

                <Connection></Connection>

            </section>

        </>
    );
};

export default DashBoardLogin;