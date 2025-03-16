import React from 'react';
import './css/dashboard.scss'
import Connection from "./connection";
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