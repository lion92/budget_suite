import React, {useCallback, useEffect, useState} from 'react';
import Graph from "./Graph";
import lien from './lien'
import Calendar from 'react-calendar';
import GraphParDate from "./GraphParDate";
import ProgressBar from "@ramonak/react-progress-bar";
import {RiMoneyEuroCircleFill, RiPassPendingLine} from "react-icons/ri";
import {BiCategory} from "react-icons/bi";
import {CiCalendarDate, CiCircleRemove} from "react-icons/ci";
import {GrAddCircle} from "react-icons/gr";
import {RxUpdate} from "react-icons/rx";
import {MdOutlineDescription} from "react-icons/md";


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
        let [listDesDepense, setListDesDepense] = useState([]);
        let [descriptionFiltre, setDescriptionFiltre] = useState("");
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
        let [monthNumSave, selectMonthNumSave] = useState(1);
        let [messageAjout, setMessageAjout] = useState("");
        let [categorieFiltre, setCategorieFiltre] = useState("");
        const [modalDescription, setModalDescription] = useState(false);
        const [modalCategorie, setModalCategorie] = useState(false);
        const [modalMontant, setModalMontant] = useState(false);
        const [modalDate, setModalDate] = useState(false);
        const toggleDescription = () => {
            setModalDescription(!modalDescription);
        };
        const toggleDate= () => {
            setModalDate(!modalDate);
        };
        const toggleMontant = () => {
            setModalMontant(!modalMontant);
        };
        const toggleCategorie = () => {
            setModalCategorie(!modalCategorie);
        };

        if (modalDescription) {
            document.body.classList.add('active-modal')
        } else {
            document.body.classList.remove('active-modal')
        }

        if (modalCategorie) {
            document.body.classList.add('active-modal')
        } else {
            document.body.classList.remove('active-modal')
        }

        if (modalDate) {
            document.body.classList.add('active-modal')
        } else {
            document.body.classList.remove('active-modal')
        }

        if (modalMontant) {
            document.body.classList.add('active-modal')
        } else {
            document.body.classList.remove('active-modal')
        }

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
            labels: listDesDepense.map(value => value.description + "" + value.dateTransaction),
            datasets: [{
                label: "Depense par date",
                backgroundColor: 'pink',
                borderColor: 'red',
                fill: false,
                data: listDesDepense.map(value => {
                    return {x: value.dateTransaction, y: value?.montant}
                }),
            }]
        };


        const fetchAPICat2 = useCallback(async () => {
            let str = localStorage.getItem("month")
            let idUser = parseInt("" + localStorage.getItem("utilisateur"))
            const response = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + str)
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
        }, [setListDesDepense]);

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
                await setListDesDepense(f);
            } else {
                let f = await fetchAPI();
                await console.log(f);
                let tab = await f.filter((elemt) => {
                        return ("" + elemt.montant === "" + montant)
                    }
                );
                await setListDesDepense(tab);
            }

            fetchAPICat2();
        };


        async function filterByMonth(monthNum) {


            let month = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];

            let tout = await fetchAPI().then(value => value.filter(value2 => (value2.dateTransaction.toString().split("-")[1]) == (month.indexOf(monthNum) + 1)));
            await setListDesDepense(await fetchAPI().then(value => value.filter(value2 => (value2.dateTransaction.toString().split("-")[1]) == (month.indexOf(monthNum) + 1))));

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
            await setListDesDepense(resbis);
            setMontantTotal(resbis.map(val => val.montant).reduce(function (a, b) {
                return a + b;
            }, 0))
            return resbis;
        }, [setListDesDepense]);


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
                        dateTransaction: datePick.toLocaleString("zh-CN", {timeZone: 'Europe/Paris'})
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const resbis = await response;
            await fetchAPI();
            await fetchAPICat2();
            await setMessageAjout("Ajout de " + montant + " categorie " + actionCategorie + " description " + actionDescription)

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
                        dateTransaction: datePick.toLocaleString("zh-CN", {timeZone: 'Europe/Paris'})
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
        ///////////////////


        /////////////////////////
        return (
            <div>
                {modalDescription && (
                    <div className="modal">
                        <div onClick={toggleDescription} className="overlay"></div>
                        <div className="modal-content containerButton">
                            <h1>Description</h1>
                            <div>
                                <input value={actionDescription}
                                       onChange={(e) => setActionDescription(e.target.value)}/>{" "}
                                <p className="error">{actionDescriptionError}</p>
                            </div>
                            <div>

                            </div>

                        </div>
                    </div>
                )}

                {modalMontant && (
                    <div className="modal">
                        <div onClick={toggleMontant} className="overlay"></div>
                        <div className="modal-content containerButton">
                            <h1>Montant</h1>
                            <div>
                                <input value={montant}
                                       onChange={(e) => setMontant(e.target.value)}/>{" "}
                                <p className={montantCSS + " " + "error"}>{montant}</p>
                            </div>
                            <div>

                            </div>

                        </div>
                    </div>
                )}

                {modalCategorie && (
                    <div className="modal">
                        <div onClick={toggleCategorie} className="overlay"></div>
                        <div className="modal-content containerButton">
                            <h1>Categorie</h1>
                            <div>
                                {textCat.map((option, index) => {
                                    return <h1 className="but1" onClick={() => {
                                        setIdCat(option)
                                    }}
                                               key={option.id}>
                                        {option.id + " " + option.categorie}


                                    </h1>
                                })}
                            </div>
                            <div>

                            </div>

                        </div>
                    </div>
                )}

                {modalDate && (
                    <div className="modal">
                        <div onClick={toggleDate} className="overlay"></div>
                        <div className="modal-content containerButton">
                            <h1>Date</h1>
                            <div className="containerCote">


                                <div>
                                    <div
                                        >{datePick.toLocaleString("zh-CN", {timeZone: 'Europe/Paris'})}</div>
                                    <Calendar onChange={onChangeDatePick}
                                              value={datePick.toLocaleString("zh-CN", {timeZone: 'Europe/Paris'})}/>
                                </div>
                            </div>
                            <div>

                            </div>

                        </div>
                    </div>
                )}



                <div className="containerButton">
                    <div className="containerButton">
                        <button onClick={() => {
                            if (budgetCSS === "visible") {

                                setBudgetCSS("hidden")
                            } else {
                                setBudgetCSS("visible");
                            }
                        }}>Ajouter un budget
                            <RiMoneyEuroCircleFill style={{fontSize: "5em", color: 'blueviolet'}}/>
                        </button>
                        <input className={budgetCSS} value={budget} onChange={(e) => setBudget(e.target.value)}/>
                        <p className={budgetCSS}>
                        </p>

                        <ProgressBar className={budgetCSS} completed={calcul() / 100}
                        />
                    </div>
                    <div>
                        <div className="containerButton">

                            <div>
                                <div className="cache">
                                    <input value={idMontant} onChange={(e) => setIdMontant(e.target.value)}/>{" "}
                                </div>
                                <div className="containerButton">
                                    <button onClick={toggleCategorie}>Ajouter une categorie
                                        <BiCategory style={{fontSize: '5em', color: 'blueviolet'}}/>
                                    </button>
                                    <p className={categorieCSS}>{actionCategorie}</p>

                                    <p className="error">{actionCategorieError}</p>
                                </div>
                            </div>
                            <div className="containerButton">
                                <button onClick={toggleDescription}>
                                    Ajouter une description
                                    <MdOutlineDescription style={{fontSize:'5em',color:'blueviolet'}}/>

                                </button>


                            </div>

                            <div className="containerCote containerButton">
                                <button onClick={toggleMontant}>Ajouter un montant
                                    <RiPassPendingLine style={{fontSize: '5em', color: 'blueviolet'}}/>
                                </button>

                            </div>
                            <button onClick={toggleDate}>Ajouter une date
                                <CiCalendarDate style={{fontSize: '5em', color: 'blueviolet'}}/>
                            </button>

                            <div className="containerCote">
                                <button onClick={(e) => {
                                    e.preventDefault();
                                    if (buttonCSS === "visible") {

                                        setbuttonCSS("hidden")
                                    } else {
                                        setbuttonCSS("visible");
                                    }
                                }}>Acceder aux bouttons
                                </button>
                                <div className={buttonCSS}>
                                    <button onClick={fetchCreer}>creer <GrAddCircle
                                        style={{fontSize: '5em', color: 'blueviolet'}}/></button>
                                    <div>{messageAjout}</div>
                                    <button onClick={modifier}>modifier <RxUpdate
                                        style={{fontSize: '5em', color: 'blueviolet'}}/></button>

                                    <div>
                                        <button onClick={deleteMontant}><CiCircleRemove
                                            style={{fontSize: '5em', color: 'blueviolet'}}/>Supprimer
                                        </button>
                                    </div>
                                    <button onClick={getData}>Download</button>
                                </div>
                            </div>
                            <div>

                            </div>

                        </div>

                    </div>
                </div>

                <div>
                    <div className="containerButton">
                        <label>Filtre par date</label>
                        <select onChange={async (e) => {
                            await filterByMonth(e.target.value);
                            let month = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
                            localStorage.setItem("month", "" + (month.indexOf(e.target.value) + 1));
                            fetchAPICat2()
                        }}
                                className='form-select'>
                            <option>Janvier</option>
                            <option>Fevrier</option>
                            <option>Mars</option>
                            <option>Avril</option>
                            <option>Mai</option>
                            <option>Juin</option>
                            <option>Juillet</option>
                            <option>Aout</option>
                            <option>Septembre</option>
                            <option>Octobre</option>
                            <option>Novembre</option>
                            <option>Decembre</option>


                        </select>
                        <label>Filtre de Description</label>
                        <input value={descriptionFiltre}
                               onChange={(e) => {
                                   setDescriptionFiltre(e.target.value)
                               }}/>

                        <button onClick={() => {
                            setListDesDepense(listDesDepense.filter(value => value.description.includes(descriptionFiltre)))
                        }}>Actualiser la liste
                        </button>

                        <label>Filtre de Categorie</label>
                        <input value={categorieFiltre}
                               onChange={(e) => {
                                   setCategorieFiltre(e.target.value)
                               }}/>

                        <button onClick={() => {
                            setListDesDepense(listDesDepense.filter(value => value.categorie.includes(categorieFiltre)))
                        }}>Actualiser la liste
                        </button>
                    </div>
                    <table>
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Montant</th>
                            <th>Description</th>
                            <th>Categorie Id</th>
                            <th>Categorie</th>
                            <th>Date de la dépense</th>
                            <th>Date d'ajout</th>
                        </tr>
                        </thead>
                        <tbody>

                        {listDesDepense.map((item, index) => {
                            return (
                                <>
                                    <tr onClick={() => {
                                        setIdMontant(item.id);
                                        setMontant(item.montant);
                                        setActionDescription(item.description);
                                    }}>
                                        <th>{item.id}</th>
                                        <th className="montant">{item.montant}</th>
                                        <th className="description">{item.description}</th>
                                        <th className="description">{item.categorieId}</th>
                                        <th className="description">{item.categorie}</th>
                                        <th className="description">{item.dateTransaction}</th>
                                        <th className="description">{item.dateAjout}</th>

                                    </tr>
                                </>
                            );
                        })}
                        </tbody>
                        <tfoot>
                        <tr>
                            <th scope="row" colSpan="2"></th>
                            <td colSpan="2">montantTotal{montantTotal}</td>
                        </tr>
                        </tfoot>
                    </table>


                </div>
                <div>
                    <Graph data={data}></Graph>
                    <GraphParDate data={dataParDate}></GraphParDate>
                </div>
            </div>

        );
    }
}

export default Budget;