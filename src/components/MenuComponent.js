import {Link, NavLink} from "react-router-dom";
import React, {useState} from "react";
import {SiWelcometothejungle} from "react-icons/si";
import {TbLogin2} from "react-icons/tb";
import {MdOutlineAppRegistration} from "react-icons/md";
import {BiSolidCategory} from "react-icons/bi";
import {GoTasklist} from "react-icons/go";
import {CiMenuBurger, CiMoneyBill} from "react-icons/ci";
import DashBoardLogin from "./DashLogin";
import CookieConsent from "./cookie_bandeau";

export default function MenuComponent(props) {
    const [sidebar, setSideBar] = useState("sidebar");
    const [afficher, setAfficher] = useState(false)
    const [content, setContent] = useState("home-section")
    let handlemenu = (e) => {
        if (afficher) {
            setSideBar("sidebar")
            setContent("home-section")
            setAfficher(!afficher)
        } else {
            setSideBar("hideSidebar")
            setContent("home-section-hide")
            setAfficher(!afficher)
        }

    }


    return (
        <>

            <div className={sidebar}>
                <div className="logo-details">
                    <div className="logo_name">Kriss CLOTILDE Budget</div>
                </div>



                <ul className="nav-list">
                    <NavLink to={"/"}>
                        <li>Bienvenue <SiWelcometothejungle /> </li>
                    </NavLink>
                    <NavLink to={"/login"}>
                        <li>Connexion <TbLogin2 /></li>
                    </NavLink>
                    <NavLink to={"/inscription"}>
                        <li>Inscription<MdOutlineAppRegistration /></li>
                    </NavLink>
                    <NavLink to={"/categorie"}>
                        <li>Categorie<BiSolidCategory /></li>
                    </NavLink>
                    <NavLink to={"/form"}>
                        <li>Tache<GoTasklist /></li>
                    </NavLink>
                    <NavLink to={"/budget"}>
                        <li>Budget<CiMoneyBill /></li>
                    </NavLink>
                    <NavLink to={"/allspend"}>
                        <li>Toutes les dépenses<CiMoneyBill /></li>
                    </NavLink>
                    <NavLink to={"/agenda"}>
                        <li>Agenda<CiMoneyBill /></li>
                    </NavLink>

                </ul>
            </div>
            <section className={content}>



                <CookieConsent></CookieConsent>
                <h1>{props.title}</h1>
                <button onClick={handlemenu}><CiMenuBurger /></button>
                {props.contenue}

            </section>

        </>
    )
}