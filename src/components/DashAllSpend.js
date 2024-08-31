import React from 'react';
import './dashboard.scss'
import MenuComponent from "./MenuComponent";
import AllSpend from "./AllSpend";

const DashAllSpend = () => {
    let titre = "Budget"
    let contenue = <AllSpend></AllSpend>
    return (
        <>
            <MenuComponent contenue={contenue} title={titre}></MenuComponent>
        </>
    );
};

export default DashAllSpend;