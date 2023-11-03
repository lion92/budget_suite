import React from 'react';
import './dashboard.scss'
import Connection from "./connection";
import {Link, NavLink} from "react-router-dom";
import {Categorie} from "./Categorie";
import MenuComponent from "./MenuComponent";

const DashBoardLogin = () => {

    let titre = "Connection"
    let contenue = <Connection></Connection>

    return (
        <>
            <MenuComponent contenue={contenue} title={titre}></MenuComponent>
        </>

    );
};

export default DashBoardLogin;