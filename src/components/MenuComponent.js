import {NavLink} from "react-router-dom";
import React, {useState} from "react";

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
                        <li>Bienvenue</li>
                    </NavLink>
                    <NavLink to={"/login"}>
                        <li>Login</li>
                    </NavLink>
                    <NavLink to={"/inscription"}>
                        <li>Inscription</li>
                    </NavLink>
                    <NavLink to={"/categorie"}>
                        <li>Categorie</li>
                    </NavLink>
                    <NavLink to={"/form"}>
                        <li>Tache</li>
                    </NavLink>
                    <NavLink to={"/budget"}>
                        <li>Budget</li>
                    </NavLink>

                </ul>
            </div>
            <section className={content}>


                <div id="header">
                    <div className="header uboxed">
                        <ul className="logo">
                            <li>

                            </li>
                        </ul>
                        <ul className="menu">
                            <li></li>
                            <li></li>
                            <li>
                                <div id="lang">
                                    <div className="selected"></div>
                                    <div className="options">
                                        <a href="#"></a>
                                        <a href="#"></a>
                                        <a href="#"></a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>

                <h1>{props.title}</h1>
                <button onClick={handlemenu}>Menu</button>
                {props.contenue}

            </section>

        </>
    )
}