import React from 'react';
import './dashboard.scss'
import {NavLink} from "react-router-dom";
import './dash.scss'
import {RiLockPasswordLine, RiMoneyEuroCircleFill} from "react-icons/ri";
import {LuMailOpen} from "react-icons/lu";
import {Categorie} from "./Categorie";
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