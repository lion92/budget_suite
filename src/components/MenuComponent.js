import { NavLink } from "react-router-dom";
import React, { useState } from "react";
import { SiWelcometothejungle } from "react-icons/si";
import { TbLogin2 } from "react-icons/tb";
import { MdOutlineAppRegistration } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import { GoTasklist } from "react-icons/go";
import { CiMenuBurger, CiMoneyBill } from "react-icons/ci";
import CookieConsent from "./cookie_bandeau";
import Notifications from "../Notification";

export default function MenuComponent(props) {
    const [afficher, setAfficher] = useState(true);

    const handlemenu = () => {
        setAfficher(!afficher);
    };

    const styles = {
        container: {
            display: "flex",
            width: "100vw",
            minHeight: "100vh",
        },
        sidebar: {
            width: 220,
            backgroundColor: "#EBDDFB",
            paddingTop: 60,
            minHeight: "100vh",
            transition: "transform 0.3s ease",
        },
        sidebarHidden: {
            display: "none",
        },
        navList: {
            listStyle: "none",
            padding: 0,
            margin: 0,
        },
        navItem: {
            padding: "15px",
            color: "#5D3A9B",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            transition: "background 0.2s",
        },
        navItemHover: {
            backgroundColor: "#D3B4F0",
        },
        content: {
            padding: 20,
            flexGrow: 1,
            transition: "margin-left 0.3s ease",
        },
        contentWithSidebar: {
            marginLeft: 10,
        },
        contentFullWidth: {
            width: "100%",
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        toggleBtn: {
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 25,
            color: "#5D3A9B",
        },
        notification: {
            position: "fixed",
            top: 20,
            left: 50,
            fontSize: 30,
            zIndex: 1000,
        },
        logoName: {
            textAlign: "center",
            fontSize: 24,
            fontWeight: "bold",
            color: "#5D3A9B",
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.notification}><Notifications /></div>

            <div style={afficher ? styles.sidebar : styles.sidebarHidden}>
                <div style={styles.logoName}>Budget</div>

                <ul style={styles.navList}>
                    <NavLink to="/"><li style={styles.navItem}>Bienvenue <SiWelcometothejungle /></li></NavLink>
                    <NavLink to="/login"><li style={styles.navItem}>Connexion <TbLogin2 /></li></NavLink>
                    <NavLink to="/inscription"><li style={styles.navItem}>Inscription <MdOutlineAppRegistration /></li></NavLink>
                    <NavLink to="/categorie"><li style={styles.navItem}>Catégorie <BiSolidCategory /></li></NavLink>
                    <NavLink to="/form"><li style={styles.navItem}>Tâche <GoTasklist /></li></NavLink>
                    <NavLink to="/budget"><li style={styles.navItem}>Budget <CiMoneyBill /></li></NavLink>
                    <NavLink to="/allspend"><li style={styles.navItem}>Dépenses par mois <CiMoneyBill /></li></NavLink>
                    <NavLink to="/allspendFilters"><li style={styles.navItem}>Dépenses filtrées <CiMoneyBill /></li></NavLink>
                    <NavLink to="/prediction"><li style={styles.navItem}>Prédiction <CiMoneyBill /></li></NavLink>
                    <NavLink to="/agenda"><li style={styles.navItem}>Agenda <CiMoneyBill /></li></NavLink>
                </ul>
            </div>

            <section
                style={{
                    ...styles.content,
                    ...(afficher ? styles.contentWithSidebar : styles.contentFullWidth),
                }}
            >
                <CookieConsent />
                <div style={styles.header}>
                    <h1>{props.title}</h1>
                    <button style={styles.toggleBtn} onClick={handlemenu}>
                        <CiMenuBurger />
                    </button>
                </div>
                {props.contenue}
            </section>
        </div>
    );
}
