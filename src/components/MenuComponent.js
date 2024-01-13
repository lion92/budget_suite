import {Link, NavLink} from "react-router-dom";
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
                <Link style={{width: '20px', margin: '0'}} onClick={() => {
                    localStorage.removeItem('jwt');
                    localStorage.removeItem("utilisateur");
                }} to="/">
                    <button style={{color: 'red'}}>Deconnexion</button>
                </Link>
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




                <h1>{props.title}</h1>
                <button onClick={handlemenu}>Menu</button>
                {props.contenue}

            </section>

        </>
    )
}