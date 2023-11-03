import React from 'react';
import './dashboard.scss'
import MenuComponent from "./MenuComponent";
import Inscription from "./inscription";

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