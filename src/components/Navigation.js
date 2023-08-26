import React from 'react';
import {NavLink} from "react-router-dom";
import Helloword from "./Helloword";

const Navigation = () => {
    return (
        <>
        <Helloword></Helloword>
        <nav className="menu">
            <ul className='containerTitle' >
                <NavLink to={"/"}>
                    <li>Bienvenue</li>
                </NavLink>
                <NavLink to={"/login"}>
                    <li>Login</li>
                </NavLink>
                <NavLink to={"/inscription"}>
                    <li>Incription</li>
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

        </nav>
            <p>Bienvenue</p>
        </>
    );
};

export default Navigation;