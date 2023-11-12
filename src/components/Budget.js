import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import BarGraph from "./BarGraph";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
        let [tousLesMois, settousLesMois] = useState([]);
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
        const [year, setYear] = useState("2023");
        const [catAll, setCatAll] = useState([]);
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

        const dataTous = {
            labels: catAll.map(value => "voir la legende des couleurs"),
            datasets: [
                {
                    label: 'Montant par catégorie janvier',
                    data: tousLesMois?.length > 0 ? tousLesMois[0].map(value => value.montant) : [],
                    backgroundColor: tousLesMois?.length > 0 ? tousLesMois[0].map(value => value.color) : [],
                    borderColor: 'black',

                }, {
                    label: 'Montant par catégorie fevrier',
                    data: tousLesMois?.length > 0 ? tousLesMois[1].map(value => value.montant) : [],
                    backgroundColor: tousLesMois?.length > 0 ? tousLesMois[1].map(value => value.color) : [],
                    borderColor: 'black',

                }, {
                    label: 'Montant par catégorie mars',
                    data: tousLesMois?.length > 0 ? tousLesMois[2].map(value => value.montant) : [],
                    backgroundColor: tousLesMois?.length > 0 ? tousLesMois[2].map(value => value.color) : [],
                    borderColor: 'black',

                },
                {
                    label: 'Montant par catégorie avril',
                    data: tousLesMois?.length > 0 ? tousLesMois[3].map(value => value.montant) : [],
                    backgroundColor: tousLesMois?.length > 0 ? tousLesMois[3].map(value => value.color) : [],
                    borderColor: 'black',

                },
                {
                    label: 'Montant par catégorie mai',
                    data: tousLesMois?.length > 0 ? tousLesMois[4].map(value => value.montant) : [],
                    backgroundColor: tousLesMois?.length > 0 ? tousLesMois[4].map(value => value.color) : [],
                    borderColor: 'black',

                },
                {
                    label: 'Montant par catégorie juin',
                    data: tousLesMois?.length > 0 ? tousLesMois[5].map(value => value.montant) : [],
                    backgroundColor: tousLesMois?.length > 0 ? tousLesMois[5].map(value => value.color) : [],
                    borderColor: 'black',

                },
                {
                    label: 'Montant par catégorie juillet',
                    data: tousLesMois?.length > 0 ? tousLesMois[6].map(value => value.montant) : [],
                    backgroundColor: tousLesMois?.length > 0 ? tousLesMois[6].map(value => value.color) : [],
                    borderColor: 'black',

                },
                {
                    label: 'Montant par catégorie aout',
                    data: tousLesMois?.length > 0 ? tousLesMois[7].map(value => value.montant) : [],
                    backgroundColor: tousLesMois?.length > 0 ? tousLesMois[7].map(value => value.color) : [],
                    borderColor: 'black',

                },
                {
                    label: 'Montant par catégorie septembre',
                    data: tousLesMois?.length > 0 ? tousLesMois[8].map(value => value.montant) : [],
                    backgroundColor: tousLesMois?.length > 0 ? tousLesMois[8].map(value => value.color) : [],
                    borderColor: 'black',

                },
                {
                    label: 'Montant par catégorie octobre',
                    data: tousLesMois?.length > 0 ? tousLesMois[9].map(value => value.montant) : [],
                    backgroundColor: tousLesMois?.length > 0 ? tousLesMois[9].map(value => value.color) : [],
                    borderColor: 'black',

                },
                {
                    label: 'Montant par catégorie novembre',
                    data: tousLesMois?.length > 0 ? tousLesMois[10].map(value => value.montant) : [],
                    backgroundColor: tousLesMois?.length > 0 ? tousLesMois[10].map(value => value.color) : [],
                    borderColor: 'black',

                },
                {
                    label: 'Montant par catégorie decembre',
                    data: tousLesMois?.length > 0 ? tousLesMois[11].map(value => value.montant) : [],
                    backgroundColor: tousLesMois?.length > 0 ? tousLesMois[11].map(value => value.color) : [],
                    borderColor: 'black',

                },

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

        const fetchAPICat3 = useCallback(async () => {
            let tousMois = [];
            let idUser = parseInt("" + localStorage.getItem("utilisateur"))
            let getyear = parseInt("" + localStorage.getItem("year"))
            if (isNaN(year)) {
                return
            }
            const response1 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 1 + "/" + getyear)
            let resbisJanvier = await response1.json();


            const response2 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 2 + "/" + getyear)
            let resbisFevrier = await response2.json();


            const response3 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 3 + "/" + getyear)
            let resbisMars = await response3.json();

            const response4 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 4 + "/" + getyear)
            let resbisAvril = await response4.json();

            const response5 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 5 + "/" + getyear)
            let resbisMai = await response5.json();

            const response6 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 6 + "/" + getyear)
            let resbisJuin = await response6.json();


            const response7 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 7 + "/" + getyear)
            let resbisJuillet = await response7.json();


            const response8 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 8 + "/" + getyear)
            let resbisAout = await response8.json();


            const response9 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 9 + "/" + getyear)
            let resbisSeptembre = await response9.json();

            const response10 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 10 + "/" + getyear)
            let resbisOctobre = await response10.json();

            const response11 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 11 + "/" + getyear)
            let resbisNovembre = await response11.json();

            const response12 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 12 + "/" + getyear)
            let resbisDecembre = await response12.json();
            tousMois.push(resbisJanvier);
            tousMois.push(resbisFevrier);
            tousMois.push(resbisMars);
            tousMois.push(resbisAvril);
            tousMois.push(resbisMai)
            tousMois.push(resbisJuin)
            tousMois.push(resbisJuillet);
            tousMois.push(resbisAout);
            tousMois.push(resbisSeptembre);
            tousMois.push(resbisOctobre);
            tousMois.push(resbisNovembre);
            tousMois.push(resbisDecembre);


            await console.log(tousMois)
            await settousLesMois(tousMois);


            return tousMois;
        }, [setTextCat2]);


        const fetchAPICat2 = useCallback(async () => {
            let getyear = parseInt("" + localStorage.getItem("year"))
            if (isNaN(year)) {
                return
            }
            let str = localStorage.getItem("month")
            let idUser = parseInt("" + localStorage.getItem("utilisateur"))
            const response = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + str + "/" + getyear)
            const resbis = await response.json();
            await setTextCat2(resbis);

            return resbis;
        }, [setTextCat2]);


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
            fetchAPICat3();

            await fetchAPICat2();
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

            await setMontantTotal(tout.filter(value => value.dateTransaction.split("-")[0] == year).map(val => val.montant).reduce(function (a, b) {
                return a + b;
            }, 0))
        }

        const fetchAPIToutCategorie = useCallback(async () => {
            let idUser = parseInt("" + localStorage.getItem("utilisateur"))
            const response = await fetch(lien.url + "categorie/byuser/" + idUser);
            const resbis = await response.json();
            await setCatAll(resbis);

            return resbis;
        }, [setCatAll]);
        ////////////////////////////////////////////
        ///////////////////fectchApi/////////////////////////
        const fetchAPI = useCallback(async () => {
            let idUser = parseInt("" + localStorage.getItem("utilisateur"))
            const response = await fetch(lien.url + "action/byuser/" + idUser);
            const resbis = await response.json();
            await setListDesDepense(resbis);
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

        const pdfref = useRef();



    const downloadPDF = () => {
        const input = pdfref.current;
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4', true);

            // doc and image dimensions
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            const ratio=Math.min(pdfWidth/imgWidth,pdfHeight/imgHeight)
            const imgX=(pdfWidth-imgWidth*ratio)/2;
            const imgY=30

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth*ratio, imgHeight*ratio);
            pdf.save('Garph.pdf');
        });


}

        /////////////////////////
        return (
            <div>
                {modalDescription && (
                    <div className="modal">
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
                                {catAll.map((option, index) => {
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

                <h1>montantTotal: {montantTotal}</h1>
                <h1>Nombre de
                    dépense: {"" + listDesDepense.filter(value => value?.dateTransaction?.split("-")[0] == year)?.length}</h1>
                <ProgressBar className={budgetCSS} completed={calcul() / 100}
                />
                <div className="containerButton">
                    <div>

                        <div>

                            <div className="containerCote">
                                <div className="containerButton">
                                    <div><label>Filtre de Categorie</label>
                                        <input type="number" placeholder="Annee" value={year}
                                               onChange={(e) => {
                                                   setYear(e.target.value)
                                               }}/>{
                                            year
                                        }</div>

                                    <button onClick={async () => {
                                        await localStorage.setItem("year", year);
                                        await setListDesDepense(listDesDepense.filter(value => "" + value.dateTransaction?.split("-")[0] == "" + year))
                                        await setMontantTotal(listDesDepense.filter(value => value.dateTransaction.split("-")[0] == year).map(val => val.montant).reduce(function (a, b) {
                                            return a + b;
                                        }, 0))
                                        fetchAPICat3()
                                        await fetchAPICat2()
                                        await fetchAPI()
                                    }}>Tous les mois par categories
                                    </button>
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
                                </div>
                                <div className="containerButton">
                                    <label>Filtre de Description</label>
                                    <input placeholder="Description" value={descriptionFiltre}
                                           onChange={(e) => {
                                               setDescriptionFiltre(e.target.value)
                                           }}/>

                                    <button onClick={async () => {
                                        await setListDesDepense(listDesDepense.filter(value => value.dateTransaction.split("-")[0] == year).filter(value => value.description.includes(descriptionFiltre)))
                                        await setMontantTotal(listDesDepense.filter(value => value.description.includes(descriptionFiltre)).filter(value => value.dateTransaction.split("-")[0] == year).map(value => value.montant).reduce(function (a, b) {
                                            return a + b;
                                        }, 0))
                                    }}>Actualiser
                                    </button>
                                </div>
                                <div>
                                    <label>Filtre de Categorie</label>
                                    <input placeholder="Categorie" value={categorieFiltre}
                                           onChange={(e) => {
                                               setCategorieFiltre(e.target.value)
                                           }}/>

                                    <button onClick={async () => {
                                        await setListDesDepense(listDesDepense.filter(value => value.categorie.includes(categorieFiltre)))
                                        await setMontantTotal(listDesDepense.filter(value => value.categorie.includes(categorieFiltre)).map(value => value.montant).reduce(function (a, b) {
                                            return a + b;
                                        }, 0))
                                    }}>Actualiser
                                    </button>
                                </div>
                            </div>
                            <div className="containerCote">
                                <div className="containerCote">
                                    <button className="butGenerique" onClick={() => {
                                        if (budgetCSS === "visible") {

                                            setBudgetCSS("hidden")
                                        } else {
                                            setBudgetCSS("visible");
                                        }
                                    }}>Ajouter un budget
                                        <RiMoneyEuroCircleFill style={{fontSize: "5em", color: 'blueviolet'}}/>
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
                                        <button className="butGenerique" onClick={toggleCategorie}>Ajouter une categorie
                                            <BiCategory style={{fontSize: '5em', color: 'blueviolet'}}/>
                                        </button>
                                        <p className={categorieCSS}>{actionCategorie}</p>

                                        <p className="error">{actionCategorieError}</p>
                                    </div>
                                </div>
                                <div className="containerButton">
                                    <button className="butGenerique" onClick={toggleDescription}>
                                        Ajouter une description
                                        <MdOutlineDescription style={{fontSize: '5em', color: 'blueviolet'}}/>

                                    </button>


                                </div>

                                <div className="containerCote containerButton">
                                    <button className="butGenerique" onClick={toggleMontant}>Ajouter un montant
                                        <RiPassPendingLine style={{fontSize: '5em', color: 'blueviolet'}}/>
                                    </button>

                                </div>
                                <button className="butGenerique" onClick={toggleDate}>Ajouter une date
                                    <CiCalendarDate style={{fontSize: '5em', color: 'blueviolet'}}/>
                                </button>


                            </div>
                            <div style={{"margin": "10px"}}>
                                <button className="butGenerique" onClick={(e) => {
                                    e.preventDefault();
                                    if (buttonCSS === "visible") {

                                        setbuttonCSS("hidden")
                                    } else {
                                        setbuttonCSS("visible");
                                    }
                                }}>Acceder aux bouttons
                                </button>
                                <div className={buttonCSS}>
                                    <div className="containerCote">
                                        <button className="butGenerique" onClick={fetchCreer}>creer <GrAddCircle
                                            style={{fontSize: '5em', color: 'blueviolet'}}/></button>
                                        <div>{messageAjout}</div>
                                        <button className="butGenerique" onClick={modifier}>modifier <RxUpdate
                                            style={{fontSize: '5em', color: 'blueviolet'}}/></button>

                                        <div>
                                            <button className="butGenerique" onClick={deleteMontant}><CiCircleRemove
                                                style={{fontSize: '5em', color: 'blueviolet'}}/>Supprimer
                                            </button>
                                        </div>
                                        <button className="butGenerique" onClick={getData}>Download</button>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
                <div ref={pdfref}>
                    <h1>Toutes les dépenses du tableau</h1>
                    <GraphParDate data={dataParDate}></GraphParDate>

                    <h1>Dépense par mois</h1>
                    <h1>Systeme des budget par catégorie</h1>
                    <div className="containerCote">
                        {textCat2?.length > 0 ? textCat2.map(value => {
                            return <>
                                <div style={{color: 'black'}}>
                                    <h2 style={{color: 'blue', marginBottom: '5px'}}>{value.categorie}</h2>
                                    <input type="color" id="favcolor" name="favcolor" value={value.color}/>
                                    <h2 style={{color: 'black'}}>Debut mois: {value.budgetDebutMois}</h2>
                                    <h2 style={{color: 'black'}}>En cours: {value.montant}</h2>

                                    <h2 style={{color: 'black'}}>Montant
                                        restant: {value.budgetDebutMois - value.montant}</h2>
                                </div>
                            </>
                        }) : []} </div>
                    <button onClick={downloadPDF}>dl pdf</button>
                    <Graph data={data}></Graph>
                    <h1>Dépense par mois</h1>
                    <BarGraph data={data}></BarGraph>
                    <h1>Tous les mois</h1>
                    <Graph data={dataTous}></Graph>
                    <div className="containerCote">
                        {catAll.map(value => {
                            return <>
                                <h1>{value.categorie}</h1>
                                <input type="color" id="favcolor" name="favcolor" value={value.color}/>
                            </>
                        })
                        }


                    </div>


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
                            <td colSpan="2">Nombre de dépense{"" + listDesDepense?.length}</td>
                        </tr>
                        </tfoot>
                    </table>


                </div>

            </div>

        );
    }
}

export default Budget;