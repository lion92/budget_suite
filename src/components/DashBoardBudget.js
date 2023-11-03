import React from 'react';
import './dashboard.scss'
import MenuComponent from "./MenuComponent";
import Budget from "./Budget";

const DashBoardBudget = () => {
    let titre = "Budegt"
    let contenue = <Budget></Budget>
    return (
        <>
            <MenuComponent contenue={contenue} title={titre}></MenuComponent>
        </>
    );
};

export default DashBoardBudget;