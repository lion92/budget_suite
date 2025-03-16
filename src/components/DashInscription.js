import React from 'react';
import './css/dashboard.scss'
import MenuComponent from "./MenuComponent";
import Inscription from "./Inscription";

const DashBoardInscription = () => {
    let titre = "Inscription"
    let contenue = <Inscription></Inscription>
    return (
        <>
            <MenuComponent contenue={contenue} title={titre}></MenuComponent>
        </>
    )
        ;
};

export default DashBoardInscription;