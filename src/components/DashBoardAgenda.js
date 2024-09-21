import React from 'react';
import './dashboard.scss'
import MenuComponent from "./MenuComponent";
import Budget from "./Budget";
import Agenda from "./Agenda";

const DashBoardBudget = () => {
    let titre = "Budget"
    let contenue = <Agenda></Agenda>
    return (
        <>
            <MenuComponent contenue={contenue} title={titre}></MenuComponent>
        </>
    );
};

export default DashBoardBudget;