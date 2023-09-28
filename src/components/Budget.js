import React, {useCallback, useEffect, useState} from 'react';
import Graph from "./Graph";
import lien from './lien'
import Calendar from 'react-calendar';
import GraphParDate from "./GraphParDate";
import ProgressBar from "@ramonak/react-progress-bar";
import {NavLink} from "react-router-dom";

export function Budget(props) {


    {
        let [actionDescription, setActionDescription] = useState("");
        let [idMontant, setIdMontant] = useState(-1);
        let [montant, setMontant] = useState(0);
        let [montantError, setMontantError] = useState(0);
        let [actionCategorieError, setActionCategorieError] = useState("");
        let [actionCategorie, setActionCategorie] = useState("");
        let [actionDescriptionError, setActionDescriptionError] = useState("");
        let [valueInput, setValue] = useState("");
        let [valueInputDescription, setDescription] = useState("");
        let [idVal, setId] = useState(-1);
        let [textp, setText] = useState([]);
        let [textCat, setTextCat] = useState([]);
        let [montantTotal, setMontantTotal] = useState(0);
        let [textCat2, setTextCat2] = useState([]);
        const [load, setLoad] = useState(false);
        const [datePick, onChangeDatePick] = useState(new Date());
        const [montantCSS, setMontantCSS] = useState("hidden");
        const [budget, setBudget] = useState(0);
        const [budgetCSS, setBudgetCSS] = useState("hidden");
        const [categorieCSS, setCategorieCSS] = useState("hidden");
        const [descriptionCSS, setDescriptionCSS] = useState("hidden");
        const [dateCSS, setDateCSS] = useState("hidden");
        const [buttonCSS, setbuttonCSS] = useState("hidden");
        const [selectv, setselectedtv] = useState("");


        const data = {
            labels: textCat2.map(value => value.categorie),
            datasets: [
                {
                    label: 'Montant par catégorie',
                    data: textCat2.map(value => value.montant),
                    backgroundColor: textCat2.map(value => value.color),
                    borderColor: 'black',

                }
            ]
        };
        const dataParDate = {
            type: 'line',
            scales: {
                x: {
                    type: 'time',
                    time: {
                        // Luxon format string
                        tooltipFormat: 'DD T'
                    },
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'value'
                    }
                }
            },
            labels: textp.map(value => value.description + "" + value.dateTransaction),
            datasets: [{
                label: "Depense par date",
                backgroundColor: 'pink',
                borderColor: 'red',
                fill: false,
                data: textp.map(value => {
                    return {x: value.dateTransaction, y: value?.montant}
                }),
            }]
        };


        const fetchAPICat2 = useCallback(async () => {
            let idUser = parseInt("" + localStorage.getItem("utilisateur"))
            const response = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser);
            const resbis = await response.json();
            await setTextCat2(resbis);

            return resbis;
        }, [setTextCat2]);

        const fetchAPICat = useCallback(async () => {
            let idUser = parseInt("" + localStorage.getItem("utilisateur"))
            const response = await fetch(lien.url + "categorie/byuser/" + idUser);
            const resbis = await response.json();
            await setTextCat(resbis);

            return resbis;
        }, [setText]);

        let idCategorie = (data) => {
            let str = "" + data
            str = str.split(" ")[0];
            setActionCategorie(str);
        };
        let attendre = () => {
            setLoad(true);
            setTimeout(() => {
                setLoad(false);
            }, 2000);
            console.log(load);
        };
        useEffect(() => {
            attendre();
            fetchAPI();
            fetchAPICat();
            fetchAPICat2();
        }, []);
        ////////////////////////Rechercher/////////////
        let recherche = async (e) => {
            e.preventDefault();
            if (montant === 0) {
                let f = await fetchAPI();
                await setText(f);
            } else {
                let f = await fetchAPI();
                await console.log(f);
                let tab = await f.filter((elemt) => {
                        return ("" + elemt.montant === "" + montant)
                    }
                );
                await setText(tab);
            }

            fetchAPICat2();
        };


        async function filterByMonth(monthNum) {


            let month=["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout", "Septembre","Octobre","Novembre","Decembre"];
            let tout=await fetchAPI().then(value => value.filter(value2 => (value2.dateTransaction.toString().split("-")[1]) == (month.indexOf(monthNum)+1)));
            await setText(await fetchAPI().then(value => value.filter(value2 => (value2.dateTransaction.toString().split("-")[1]) == (month.indexOf(monthNum)+1))));

            await setMontantTotal(tout.map(val => val.montant).reduce(function (a, b) {
                return a + b;
            }, 0))
        }

        ////////////////////////////////////////////
        ///////////////////fectchApi/////////////////////////
        const fetchAPI = useCallback(async () => {
            let idUser = parseInt("" + localStorage.getItem("utilisateur"))
            const response = await fetch(lien.url + "action/byuser/" + idUser);
            const resbis = await response.json();
            await setText(resbis);
            setMontantTotal(resbis.map(val => val.montant).reduce(function (a, b) {
                return a + b;
            }, 0))
            return resbis;
        }, [setText]);


        const getData = async (e) => {
            e.preventDefault();
            let idUser = parseInt("" + localStorage.getItem("utilisateur"));
            fetch(lien.url + "action/export/" + idUser)
                .then(res => res.blob())
                .then(blob => {
                    var file = window.URL.createObjectURL(blob);
                    window.location.assign(file);
                });
        }


        /////////////////////////////////////////
        ///////////////remonter au parent//////////////////////////////iddata/////////
        let idchange = (data) => {
            setId(data);
        };
        //////////////////////////appel api en debut
        useEffect(() => {
            fetchAPI();
        }, []);
        ////////////////////////////////////////supprimme des tache
        let del = (e, data) => {
            e.preventDefault();
            fetchdelete(data);
        };
        ///////////////////////////////////////////////////////////remonter le texte
        let textebis = (data) => {
            setValue(data);
        };
        ///////////////////////////////////////////////////////////remonter le texte
        let textebisDesc = (data) => {
            setDescription(data);
        };
        /////////////////////////////
        ///////////////////////////appel delete
        let fetchdelete = useCallback(async (data) => {
            let idTodo = parseInt(data, 10)
            const response = await fetch(
                lien.url + "action/" + idTodo,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const resbis = await response;
            await fetchAPI();
            await fetchAPICat2()
        });
        //////////////////////insert tache
        let fetchCreer = useCallback(async (e) => {

            e.preventDefault();
            const response = await fetch(
                lien.url + "action",
                {
                    method: "POST",
                    body: JSON.stringify({
                        montant: montant,
                        categorie: actionCategorie,
                        description: actionDescription,
                        user: parseInt("" + localStorage.getItem("utilisateur")),
                        dateTransaction: datePick.toISOString()
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const resbis = await response;
            await fetchAPI();
            fetchAPICat2();

        });
        ////////////////////update////////////
        let fetchAPIupdate = useCallback(async () => {
            const response = await fetch(
                lien.url + "action/" + idMontant,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        categorie: actionCategorie,
                        description: actionDescription,
                        montant: montant,
                        user: parseInt("" + localStorage.getItem("utilisateur")),
                        dateTransaction: datePick.toISOString()
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const resbis = await response;
            await fetchAPI();
            fetchAPICat2();
        });
        ////////////////////////input change value
        let Valuechange = (e) => {
            let a = e.target.value;
            console.log(a);

            if (valueInput.length > 20) {


            } else {

            }
            setValue(a);
            return a;
        };
        ////////////////////////input change description
        let valueChangeDescription = (e) => {
            let a = e.target.value;
            console.log(a);

            if (valueInputDescription.length > 50) {

            } else {


            }
            return a;
        };
        /////////////////////////modifier
        let modifier = (e) => {
            e.preventDefault();
            fetchAPIupdate();
            setValue("");

        };
        let calcul = () => {
            if (montantTotal !== 0) {
                if (budget !== 0) {
                    return ((montantTotal * 100) / budget) * 100
                } else {
                    return 1
                }
            } else {
                return 0;
            }

        };

        function setIdCat(option) {
            setActionCategorie(option.id);

        };
        /////////////////////////modifier
        let deleteMontant = (e) => {
            e.preventDefault();
            fetchdelete(idMontant);
            setValue("");

        };


        /////////////////////////
        return (
            <>
                <div className="sidebar">
                    <div className="logo-details">
                        <i className='bx bxl-c-plus-plus icon'></i>
                        <div className="logo_name">CodingLab</div>
                        <i className='bx bx-menu' id="btn"></i>
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
                <section className="home-section">




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

                    <Budget></Budget>

                </section>

            </>
        );
    }
}

export default Budget;