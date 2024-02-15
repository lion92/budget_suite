import React from 'react';
import './dashboard.scss'
import './dash.scss'
import MenuComponent from "./MenuComponent";
import Helloword from "./Helloword";

const DashBoardHello = () => {
    let titre = "Hello"
    let contenue = <Helloword></Helloword>

    return (
        <>
            <MenuComponent contenue={contenue} title={titre}></MenuComponent>
        </>
    );
};

export default DashBoardHello;