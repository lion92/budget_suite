import React from 'react';
import './css/dashboard.scss'
import MenuComponent from "./MenuComponent";
import AllSpendFilters from "../AllSpendFilters";

const DashAllSpendFilters = () => {
    let titre = "Budget"
    let contenue = <AllSpendFilters></AllSpendFilters>
    return (
        <>
            <MenuComponent contenue={contenue} title={titre}></MenuComponent>
        </>
    );
};

export default DashAllSpendFilters;