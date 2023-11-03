import React from 'react';
import './dashboard.scss'
import Form from "./Form";
import MenuComponent from "./MenuComponent";

const DashBoardTache = () => {
    let titre = "Tache"
    let contenue = <Form></Form>
    return (
        <>
            <MenuComponent contenue={contenue} title={titre}></MenuComponent>
        </>

    );
};

export default DashBoardTache;