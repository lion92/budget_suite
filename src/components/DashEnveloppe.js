import React from 'react';
import './dashboard.scss'
import './dash.scss'
import MenuComponent from "./MenuComponent";
import Enveloppe from "./Enveloppe";

const DashEnveloppe = () => {
    let titre = "Enveloppe"
    let contenue = <Enveloppe></Enveloppe>
    return (
        <>
            <MenuComponent contenue={contenue} title={titre}></MenuComponent>
        </>
    );
};

export default DashEnveloppe;