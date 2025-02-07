import React, {useCallback, useEffect, useRef, useState} from 'react';
import lien from './lien'
import Calendar from 'react-calendar';
import GraphParDate from "./GraphParDate";
import ProgressBar from "@ramonak/react-progress-bar";
import {RiMoneyEuroCircleFill, RiPassPendingLine} from "react-icons/ri";
import {BiCategory} from "react-icons/bi";
import {CiCalendarDate} from "react-icons/ci";
import {GrAddCircle} from "react-icons/gr";
import {MdOutlineDescription} from "react-icons/md";
import BarGraph from "./BarGraph";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import '../budget_style.css';
import {useNotify} from "../Notification";

export function Budget(props) {


    {
        let [actionDescription, setActionDescription] = useState("");
        let [idMontant, setIdMontant] = useState(-1);
        let [montant, setMontant] = useState(0);
        let [actionCategorieError, setActionCategorieError] = useState("");
        let [actionCategorie, setActionCategorie] = useState("");
        let [actionDescriptionError, setActionDescriptionError] = useState("");
        let [valueInput, setValue] = useState("");
        let [valueInputDescription, setDescription] = useState("");
        let [listDesDepense, setListDesDepense] = useState([]);
        let [descriptionFiltre, setDescriptionFiltre] = useState("");
        let [montantTotal, setMontantTotal] = useState(0);
        let [textCat2, setTextCat2] = useState([]);
        let [tousLesMois, settousLesMois] = useState([]);
        let [tousLesMoisAll, settousLesMoisAll] = useState([]);
        const [load, setLoad] = useState(false);
        const [datePick, onChangeDatePick] = useState(new Date());
        const [montantCSS, setMontantCSS] = useState("hidden");
        const [budget, setBudget] = useState(0);
        const [budgetCSS, setBudgetCSS] = useState("hidden");
        const [categorieCSS, setCategorieCSS] = useState("hidden");
        const [, setDateCSS] = useState("hidden");
        const [buttonCSS, setbuttonCSS] = useState("hidden");
        let [messageAjout, setMessageAjout] = useState("");
        let [messageModif, setMessageModif] = useState("");
        let [messageDelete, setMessageDelete] = useState("");
        let [categorieFiltre, setCategorieFiltre] = useState("");
        const [modalDescription, setModalDescription] = useState(false);
        const [modalCategorie, setModalCategorie] = useState(false);
        const [modalMontant, setModalMontant] = useState(false);
        const [modalDate, setModalDate] = useState(false);
        const [year, setYear] = useState("2023");
        const [catAll, setCatAll] = useState([]);
        const [textCatAll, setCat2All] = useState([]);
        const [montantFiltre, setMontantFiltre] = useState(0);
        const [montantFiltre2, setMontantFiltre2] = useState(0);
        const notify = useNotify();
        const toggleDescription = () => {
            setModalDescription(!modalDescription);
        };
        const toggleDate = () => {
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

        const dataAll = {
            labels: textCatAll?.length > 0 ? textCatAll.map(value => value.categorie) : [],
            datasets: [
                {
                    label: 'Montant par catégorie',
                    data: textCatAll?.length > 0 ? textCatAll.map(value => value.montant) : [],
                    backgroundColor: textCatAll?.length > 0 ? textCatAll.map(value => value.color) : [],
                    borderColor: 'black',

                }, {
                    label: 'Budget debut mois',
                    data: textCatAll?.length > 0 ? textCatAll.map(value => value.budgetDebutMois) : [],
                    backgroundColor: textCatAll?.length > 0 ? textCatAll.map(value => value.color) : [],
                    borderColor: 'black',

                }
            ]
        };

        const data = {
            labels: textCat2?.length > 0 ? textCat2.map(value => value.categorie) : [],
            datasets: [
                {
                    label: 'Montant par catégorie',
                    data: textCat2?.length > 0 ? textCat2.map(value => value.montant) : [],
                    backgroundColor: textCat2?.length > 0 ? textCat2.map(value => value.color) : [],
                    borderColor: 'black',


                }, {
                    label: 'Budget debut mois',
                    data: textCat2?.length > 0 ? textCat2.map(value => value.budgetDebutMois) : [],
                    backgroundColor: textCat2?.length > 0 ? textCat2.map(value => value.color) : [],
                    borderColor: 'black',

                }
            ]
        };
        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Chart.js Line Chart',
                },
            },
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
            labels: listDesDepense.filter(value => value.dateTransaction.split("-")[0] == year).map(value => value.description + "" + value.dateTransaction),
            datasets: [{
                label: "Depense par date",
                backgroundColor: 'pink',
                borderColor: 'red',
                fill: false,
                data: listDesDepense.filter(value => value.dateTransaction.split("-")[0] == year).map(value => {
                    return {x: value.dateTransaction, y: value?.montant}
                }),
            }]
        };

        const apiMonthByCategory = useCallback(async () => {
            let idUser = parseInt(localStorage.getItem("utilisateur") || "");
            let getyear = parseInt(localStorage.getItem("year") || "");
            let token = localStorage.getItem("jwt");

            if (isNaN(getyear) || !token) return;

            const headers = {Authorization: `Bearer ${token}`};
            const baseUrl = `${lien.url}action/categorie/sum/byUser/${idUser}`;

            try {
                // Création d'un tableau de promesses pour récupérer les données des 12 mois
                const requests = Array.from({length: 12}, (_, index) =>
                    fetch(`${baseUrl}/${index + 1}/${getyear}`, {headers}).then(res => res.json())
                );

                // Attendre toutes les requêtes en parallèle
                const tousMois = await Promise.all(requests);

                console.log(tousMois);
                settousLesMois(tousMois);

                return tousMois;
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        }, [settousLesMois]);


        const apiMonthAll = useCallback(async () => {
            try {
                let idUser = parseInt(localStorage.getItem("utilisateur"), 10);
                let getyear = parseInt(localStorage.getItem("year"), 10) || 2023;
                let token = localStorage.getItem("jwt");

                if (isNaN(idUser) || isNaN(getyear)) return;

                let requests = Array.from({length: 12}, (_, i) =>
                    fetch(`${lien.url}action/montant/sum/byUser/${idUser}/${i + 1}/${getyear}`, {
                        headers: {Authorization: `Bearer ${token}`}
                    }).then(res => res.json())
                );

                let tousMois = await Promise.all(requests);

                console.log(tousMois);
                settousLesMoisAll(tousMois);

                return tousMois;
            } catch (error) {
                console.error("Erreur lors de la récupération des montants :", error);
            }
        }, []);


        const fetchApiCAtegorie = useCallback(async () => {
            let getyear = parseInt("" + localStorage.getItem("year"))
            if (isNaN(year)) {
                return
            }
            let str = localStorage.getItem("month")
            let idUser = parseInt("" + localStorage.getItem("utilisateur"))

            const response = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + str + "/" + getyear, {Authorization: `Bearer ${str}`})
            const resbis = await response.json();
            await setTextCat2(resbis);

            return resbis;
        }, [setTextCat2]);


        const apiCategorieAllYear = useCallback(async () => {
            try {
                let idUser = parseInt(localStorage.getItem("utilisateur"), 10);

                if (isNaN(idUser)) return;

                const response = await fetch(`${lien.url}action/categorie/sum/all/${idUser}`);
                const resbis = await response.json();

                setCat2All(resbis);
                return resbis;
            } catch (error) {
                console.error("Erreur lors de la récupération des catégories :", error);
            }
        }, [setCat2All]);


        let attendre = () => {
            setLoad(true);
            setTimeout(() => {
                setLoad(false);
            }, 2000);
            console.log(load);
        };
        useEffect(async () => {
            attendre();
            await localStorage.setItem("year", 2023);

            await fetchAPIToutCategorie();
            await fetchAPI();
            await apiMonthByCategory();
            await fetchApiCAtegorie();
            await apiCategorieAllYear();
            await apiMonthAll();
        }, []);

        ////////////////////////Rechercher/////////////


        async function filterByMonth(monthNum) {


            let month = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];

            let tout = await fetchAPI().then(value => value.filter(value2 => (value2.dateTransaction.toString().split("-")[1]) == (month.indexOf(monthNum) + 1)));


            setListDesDepense(await fetchAPI().then(value => value.filter(value2 => (value2.dateTransaction.toString().split("-")[1]) == (month.indexOf(monthNum) + 1))));

            setMontantTotal(tout.filter(value => value.dateTransaction.split("-")[0] == year).map(val => val.montant).reduce(function (a, b) {
                return a + b;
            }, 0))
        }

        const fetchAPIToutCategorie = useCallback(async () => {
            let idUser = parseInt("" + localStorage.getItem("utilisateur"))
            const response = await fetch(lien.url + "categorie/byuser/" + idUser);
            const resbis = await response.json();
            setCatAll(resbis);

            return resbis;
        }, [setCatAll]);
        ////////////////////////////////////////////
        ///////////////////fectchApi/////////////////////////
        const fetchAPI = useCallback(async () => {
            let idUser = parseInt("" + localStorage.getItem("utilisateur"))
            const response = await fetch(lien.url + "action/byuser/" + idUser);
            const resbis = await response.json();
            setListDesDepense(resbis);
            setMontantTotal(resbis.filter(value => value.dateTransaction.split("-")[0] == year).map(val => val.montant).reduce(function (a, b) {
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
            notify("Teléchargement", 'success')
        }

        const getDataPdf = async (e) => {
            e.preventDefault();
            let idUser = parseInt("" + localStorage.getItem("utilisateur"));
            fetch(lien.url + "action/generate-pdf/" + idUser)
                .then(res => res.blob())
                .then(blob => {
                    var file = window.URL.createObjectURL(blob);
                    window.location.assign(file);
                });
            notify("Teléchargement du pdf", 'success')
        }

        const getDataPdfCategorie = async (e) => {
            e.preventDefault();
            let idUser = parseInt("" + localStorage.getItem("utilisateur"));
            fetch(lien.url + "action/generateAll-categorie-bilan/" + idUser)
                .then(res => res.blob())
                .then(blob => {
                    var file = window.URL.createObjectURL(blob);
                    window.location.assign(file);
                });
            notify("Teléchargement du pdf", 'success')
        }

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

        /////////////////////////////
        ///////////////////////////appel delete
        let fetchdelete = useCallback(async (data) => {
            if (window.confirm("Êtes-vous sûr de vouloir supprimer cette donnée ?")) {
                try {
                    setMessageDelete("");
                    let idTodo = parseInt(data, 10);
                    let str = "" + localStorage.getItem('jwt');

                    const response = await fetch(
                        `${lien.url}action/${idTodo}`,
                        {
                            method: "DELETE",
                            body: JSON.stringify({jwt: str}),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    if (response.ok) {
                        setMessageDelete("Valeur supprimée");
                        await fetchApiCAtegorie(); // Met à jour les catégories après suppression
                        notify("Valeur supprimée", 'success')
                    } else {
                        const errorMessage = await response.text();
                        console.error("Erreur lors de la suppression :", errorMessage);
                        setMessageDelete("Échec de la suppression !");
                        notify("Erreur", 'error')
                    }
                } catch (error) {
                    console.error("Erreur réseau :", error);
                    setMessageDelete("Erreur réseau !");
                    notify("Erreur reseau", 'error')
                }
            } else {
                setMessageDelete("Suppression annulée !");
                notify("Suppression annulée", 'error')
            }
        }, [lien.url, fetchApiCAtegorie]);

        //////////////////////insert tache
        let apiCreate = useCallback(async (e) => {
            let str = "" + localStorage.getItem('jwt')
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
                        dateTransaction: datePick.toLocaleString("zh-CN", {timeZone: 'Europe/Paris'}),
                        jwt: str
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const resbis = await response;


            notify("Ajout de " + montant + " categorie " + actionCategorie + " description " + actionDescription, 'success')

        });
        ////////////////////update////////////
        let apiUpdate = useCallback(async () => {
            setMessageModif("")
            let str = "" + localStorage.getItem('jwt')
            const response = await fetch(
                lien.url + "action/" + idMontant,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        categorie: actionCategorie,
                        description: actionDescription,
                        montant: montant,
                        user: parseInt("" + localStorage.getItem("utilisateur")),
                        dateTransaction: datePick.toLocaleString("zh-CN", {timeZone: 'Europe/Paris'}),
                        jwt: str
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const resbis = await response;

            await apiMonthAll();
            await fetchAPIToutCategorie();
            await apiMonthByCategory();
            await apiCategorieAllYear();
            await fetchAPI();
            await fetchApiCAtegorie();
            await apiUpdate();
            setMessageModif("Valeur modifiée")
            fetchApiCAtegorie();
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
        let modifier = async (e) => {
            e.preventDefault();
            await apiUpdate();
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
            notify("Catégorie sélectionnée \n" + option.categorie, 'success')

        };
        /////////////////////////modifier
        let deleteMontant = async (e) => {
            e.preventDefault();
            await fetchdelete(idMontant);
            setValue("");
            await fetchAPIToutCategorie();
            await fetchAPI();
            await apiMonthByCategory();
            await fetchApiCAtegorie();
            await apiCategorieAllYear();
            await apiMonthAll();

        };

        let deleteMontantById = async (e, id) => {
            e.preventDefault();
            await fetchdelete(id);
            setValue("");
            await fetchAPIToutCategorie();
            await fetchAPI();
            await apiMonthByCategory();
            await fetchApiCAtegorie();
            await apiCategorieAllYear();
            await apiMonthAll();

        };
        ///////////////////

        const pdfref = useRef();


        const downloadPDF = () => {
            const input = pdfref.current;
            html2canvas(input).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a5', true);

                // doc and image dimensions
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;

                const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
                const imgX = (pdfWidth - imgWidth * ratio) / 2;
                const imgY = 1

                pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
                pdf.save('Garph.pdf');
            });
            notify("Teléchargement du pdf", 'success')

        }

        /////////////////////////
        return <div>
            <div style={{color: "black"}}>{messageAjout}</div>
            {modalDescription && <div className="modal">
                <div onClick={toggleDescription} className="overlay"></div>
                <div className="modal-content containerButton">
                    <h1>Description</h1>
                    <div>
                        <input placeholder="Description" value={actionDescription}
                               onChange={(e) => setActionDescription(e.target.value)}/>{" "}
                        <p className="error">{actionDescriptionError}</p>
                    </div>
                    <div>

                    </div>

                </div>
            </div>}

            {modalMontant && <div className="modal">
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
            </div>}

            {modalCategorie && <div className="modal">
                <div onClick={toggleCategorie} className="overlay"></div>
                <div className="modal-content containerButton">
                    <h1>Categorie</h1>
                    <div>
                        {catAll.map((option, index) => {
                            return <h1 className="but1" onClick={() => {
                                setIdCat(option)
                            }}
                                       key={option.id}>
                                {option.id + " " + option.categorie}

                            </h1>
                        })}
                    </div>
                </div>
            </div>}

            {modalDate && <div className="modal">
                <div onClick={toggleDate} className="overlay"></div>
                <div className="modal-content containerButton">
                    <h1>Date</h1>
                    <div className="containerCote">


                        <div style={{color: 'black'}}>
                            <div
                            >{datePick.toLocaleString("zh-CN", {timeZone: 'Europe/Paris'})}</div>
                            <Calendar onChange={onChangeDatePick}
                                      value={datePick.toLocaleString("zh-CN", {timeZone: 'Europe/Paris'})}/>
                        </div>
                    </div>
                </div>
            </div>}
            <div className="containerButton principaleDiv">

                <div className="containerCote">
                    <div className="containerButton">

                        <label>Filtre de l'année</label>
                        <input type="number" placeholder="Annee" value={year}
                               onChange={async (e) => {
                                   setYear("" + e.target.value)
                                   localStorage.setItem("year", e.target.value)
                               }}/>{
                        year
                    }


                        <label role="mois">Filtre par mois</label>
                        <select role="select_mois" onChange={async (e) => {
                            await filterByMonth(e.target.value);
                            let month = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
                            localStorage.setItem("month", "" + (month.indexOf(e.target.value) + 1));
                            fetchApiCAtegorie()
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

                    </div>

                    <div className="containerButton">
                        <label>Filtre de Description</label>
                        <input placeholder="Description" value={descriptionFiltre}
                               onChange={(e) => {
                                   setDescriptionFiltre(e.target.value)
                               }}/>
                        <button onClick={async () => {
                            setListDesDepense(listDesDepense.filter(value => value.dateTransaction.split("-")[0] == year).filter(value => value.description.includes(descriptionFiltre)))
                            setMontantTotal(listDesDepense.filter(value => value.description.includes(descriptionFiltre)).filter(value => value.dateTransaction.split("-")[0] == year).map(value => value.montant).reduce(function (a, b) {
                                return a + b;
                            }, 0))

                        }}>Actualiser
                        </button>
                    </div>

                    <div className="containerButton">
                        <label>Filtre de montant supérieur à:</label>
                        <input type="number" placeholder="Montant supérieur à" value={montantFiltre}
                               onChange={(e) => {
                                   setMontantFiltre(parseInt("" + e.target.value))
                               }}/>
                        <button onClick={async () => {
                            setListDesDepense(listDesDepense.filter(value => value.dateTransaction.split("-")[0] == year).filter(value => +value.montant > +montantFiltre))
                            setMontantTotal(listDesDepense.filter(value => value => +value.montant > +montantFiltre).filter(value => value.dateTransaction.split("-")[0] == year).map(value => value.montant).reduce(function (a, b) {
                                return a + b;
                            }, 0))


                        }}>Actualiser
                        </button>
                    </div>

                    <div className="containerButton">
                        <label>Filtre de montant inférieur à:</label>
                        <input type="number" placeholder="Montant inférieur à" value={montantFiltre2}
                               onChange={(e) => {
                                   setMontantFiltre2(parseInt("" + e.target.value))
                               }}/>
                        <button onClick={async () => {
                            setListDesDepense(listDesDepense.filter(value => value.dateTransaction.split("-")[0] == year).filter(value => +value.montant < +montantFiltre2))
                            setMontantTotal(listDesDepense.filter(value => value => +value.montant < +montantFiltre2).filter(value => value.dateTransaction.split("-")[0] == year).map(value => value.montant).reduce(function (a, b) {
                                return a + b;
                            }, 0))


                        }}>Actualiser
                        </button>
                    </div>

                    <div className="containerButton">
                        <label>Filtre de Categorie</label>
                        <input placeholder="Categorie" value={categorieFiltre}
                               onChange={(e) => {
                                   setCategorieFiltre(e.target.value)
                               }}/>

                        <button onClick={async () => {
                            setListDesDepense(listDesDepense.filter(value => value.categorie.includes(categorieFiltre)))
                            setMontantTotal(listDesDepense.filter(value => value.categorie.includes(categorieFiltre)).map(value => value.montant).reduce(function (a, b) {
                                return a + b;
                            }, 0))

                        }}>Actualiser
                        </button>
                    </div>
                </div>
                <div className="containerCote">
                    <div className="containerCote">
                        <button className="raise" onClick={() => {
                            if (budgetCSS === "visible") {

                                setBudgetCSS("hidden")
                            } else {
                                setBudgetCSS("visible");
                            }
                        }}>Ajouter un budget
                            <RiMoneyEuroCircleFill style={{color: 'blueviolet'}}/>
                        </button>
                        <input className={budgetCSS} value={budget}
                               onChange={(e) => setBudget(e.target.value)}/>
                        <p className={budgetCSS}>
                        </p>


                    </div>

                    <div>
                        <div className="cache">
                            <input value={idMontant} onChange={(e) => setIdMontant(e.target.value)}/>{" "}
                        </div>
                        <div className="containerButton">
                            <button className="raise" onClick={toggleCategorie}>Ajouter une categorie
                                <BiCategory style={{color: 'blueviolet'}}/>
                            </button>
                            <p className={categorieCSS}>{actionCategorie}</p>

                            <p className="error">{actionCategorieError}</p>
                        </div>
                    </div>
                    <div className="containerButton">
                        <button className="raise" onClick={toggleDescription}>
                            Ajouter une description
                            <MdOutlineDescription style={{color: 'blueviolet'}}/>

                        </button>


                    </div>

                    <div className="containerCote containerButton">
                        <button className="raise" onClick={toggleMontant}>Ajouter un montant
                            <RiPassPendingLine style={{color: 'blueviolet'}}/>
                        </button>

                    </div>
                    <button className="raise" onClick={toggleDate}>Ajouter une date
                        <CiCalendarDate/>
                    </button>


                </div>
                <button className="raise" onClick={(e) => {
                    e.preventDefault();
                    if (buttonCSS === "visible") {

                        setbuttonCSS("hidden")
                    } else {
                        setbuttonCSS("visible");
                    }
                }}>Acceder aux bouttons
                </button>
                <div style={{"margin": "10px"}}>

                    <div className={buttonCSS}>
                        <div className="containerCote">
                            <button className="raise" onClick={apiCreate}>creer <GrAddCircle
                                style={{color: 'blueviolet'}}/></button>
                            <button className="raise" onClick={getData}>Download</button>
                            <button className="raise" onClick={getDataPdf}>DownloadPDFBilan</button>
                            <button className="raise" onClick={getDataPdfCategorie}>DownloadPDF Bilan Categorie</button>
                        </div>
                    </div>
                </div>

            </div>
            <h1>Toutes les dépenses du tableau</h1>
            <GraphParDate data={dataParDate}></GraphParDate>
            <div ref={pdfref}>


                <h1>Dépense par mois par catégorie</h1>
                <div>
                    <h1>{"Numero de mois: " + localStorage.getItem("month")}</h1>
                    <BarGraph data={data}></BarGraph>

                </div>
                <h1>Dépense totale sur toutes les dépenses</h1>
                <div>
                    <BarGraph data={dataAll}></BarGraph>

                </div>
                <div className="containerButton">
                    {"Numero mois:" + localStorage.getItem("month")}
                    <h1>montantTotal: {montantTotal}</h1>

                    <h1>Nombre de
                        dépense: {"" + listDesDepense.filter(value => value?.dateTransaction?.split("-")[0] == year)?.length}</h1>


                    <div style={{margin: "10px"}}><h1>Depense en
                        cours: {textCat2.map(val => val.montant).reduce(function (a, b) {
                            return +a + +b;
                        }, 0)}</h1></div>
                    <div style={{margin: "10px"}}>
                        <h1>Budget: {textCat2.map(val => val.budgetDebutMois).reduce(function (a, b) {
                            return +a + +b;
                        }, 0)}</h1></div>
                    <div style={{margin: "10px"}}><h1>Reste à
                        dépenser: {textCat2.map(val => val.budgetDebutMois).reduce(function (a, b) {
                            return +a + +b;
                        }, 0) - textCat2.map(val => val.montant).reduce(function (a, b) {
                            return +a + +b;
                        }, 0)}</h1></div>
                    <div className="containerCote">
                        {textCat2?.length > 0 ? textCat2.map(value => {
                            return <>
                                <div style={{color: 'black', padding: "10px"}}>
                                    <h2 style={{color: 'blue', marginBottom: '5px'}}>{value.categorie}</h2>
                                    <div style={{
                                        width: "40px",
                                        height: "40px",
                                        backgroundColor: "" + value.color
                                    }}></div>
                                    <h2 style={{color: 'black'}}>Debut mois: {value.budgetDebutMois}</h2>
                                    <h2 style={{color: 'black'}}>En cours: {value.montant}</h2>

                                    <h2 style={{color: 'black'}}>Montant
                                        restant: {value.budgetDebutMois - value.montant}</h2>
                                </div>


                            </>
                        }) : []} </div>
                </div>
            </div>


            <button onClick={downloadPDF}>dl pdf</button>
            <ProgressBar className={budgetCSS} completed={calcul() / 100}
            />
            <div style={{padding: "15px"}} className="containerButton">

            </div>


            <div>

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

                    {listDesDepense.filter(value => value.dateTransaction.split("-")[0] == year).map((item, index) => {
                        return <>


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
                                <span className="span-supprimer"
                                      onClick={async (e) => {
                                          e.stopPropagation();
                                          await deleteMontantById(e, item.id);
                                      }}

                                >Supprimer
                            </span>
                            </tr>


                        </>
                            ;
                    })}
                    </tbody>
                    <tfoot>
                    <tr>
                        <th scope="row" colSpan="2"></th>
                        <td colSpan="2">montantTotal{montantTotal}</td>
                        <td colSpan="2">Nombre de dépense{"" + listDesDepense?.length}</td>
                    </tr>
                    </tfoot>
                </table>


            </div>

        </div>;
    }
}

export default Budget;