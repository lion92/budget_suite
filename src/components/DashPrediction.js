import React from 'react';
import './dashboard.scss'
import MenuComponent from "./MenuComponent";
import Prediction from "./Prediction";

const DashPrediction = () => {
    let titre = "Prediction"
    let contenue = <Prediction></Prediction>
    return (
        <>
            <MenuComponent contenue={contenue} title={titre}></MenuComponent>
        </>
    );
};

export default DashPrediction;