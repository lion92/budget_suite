import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import '../budget_style.css';

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
        let [tousLesMoisAll, settousLesMoisAll] = useState([]);
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

        const dataLine = {
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
            let str = "" + localStorage.getItem('jwt')
            if (isNaN(year)) {
                return
            }

            const response1 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 1 + "/" + getyear,{headers:{Authorization: `Bearer ${str}}`}})
            let resbisJanvier = await response1.json();


            const response2 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 2 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisFevrier = await response2.json();


            const response3 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 3 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisMars = await response3.json();

            const response4 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 4 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisAvril = await response4.json();

            const response5 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 5 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisMai = await response5.json();

            const response6 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 6 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisJuin = await response6.json();


            const response7 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 7 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisJuillet = await response7.json();


            const response8 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 8 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisAout = await response8.json();


            const response9 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 9 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisSeptembre = await response9.json();

            const response10 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 10 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisOctobre = await response10.json();

            const response11 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 11 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisNovembre = await response11.json();

            const response12 = await fetch(lien.url + "action/categorie/sum/byUser/" + idUser + "/" + 12 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
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

        const fetchAPICat3All = useCallback(async () => {
            let tousMois = [];
            let idUser = parseInt("" + localStorage.getItem("utilisateur"))
            let getyear = parseInt("" + localStorage.getItem("year"))==undefined||parseInt("" + localStorage.getItem("year"))==null?2023:localStorage.getItem("year")
            let str = "" + localStorage.getItem('jwt')
            if (isNaN(year)) {
                return
            }

            const response1 = await fetch(lien.url + "action/montant/sum/byUser/" + idUser + "/" + 1 + "/" + getyear,{headers:{Authorization: `Bearer ${str}}`}})
            let resbisJanvier = await response1.json();


            const response2 = await fetch(lien.url + "action/montant/sum/byUser/" + idUser + "/" + 2 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisFevrier = await response2.json();


            const response3 = await fetch(lien.url + "action/montant/sum/byUser/" + idUser + "/" + 3 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisMars = await response3.json();

            const response4 = await fetch(lien.url + "action/montant/sum/byUser/" + idUser + "/" + 4 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisAvril = await response4.json();

            const response5 = await fetch(lien.url + "action/montant/sum/byUser/" + idUser + "/" + 5 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisMai = await response5.json();

            const response6 = await fetch(lien.url + "action/montant/sum/byUser/" + idUser + "/" + 6 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisJuin = await response6.json();


            const response7 = await fetch(lien.url + "action/montant/sum/byUser/" + idUser + "/" + 7 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisJuillet = await response7.json();


            const response8 = await fetch(lien.url + "action/montant/sum/byUser/" + idUser + "/" + 8 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisAout = await response8.json();


            const response9 = await fetch(lien.url + "action/montant/sum/byUser/" + idUser + "/" + 9 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisSeptembre = await response9.json();

            const response10 = await fetch(lien.url + "action/montant/sum/byUser/" + idUser + "/" + 10 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisOctobre = await response10.json();

            const response11 = await fetch(lien.url + "action/montant/sum/byUser/" + idUser + "/" + 11 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
            let resbisNovembre = await response11.json();

            const response12 = await fetch(lien.url + "action/montant/sum/byUser/" + idUser + "/" + 12 + "/" + getyear,{headers:{Authorization: `Bearer ${str}`}})
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
            await settousLesMoisAll(tousMois);


            return tousMois;
        },[]);


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


        const fetchApiCAtegorieAll = useCallback(async () => {
            if (isNaN(year)) {
                return
            }
            let idUser = parseInt("" + localStorage.getItem("utilisateur"))

            const response = await fetch(lien.url + "action/categorie/sum/all/" + idUser)
            const resbis = await response.json();
            await setCat2All(resbis);

            return resbis;
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
            await fetchAPICat3();
            await fetchApiCAtegorie();
            await fetchApiCAtegorieAll();
            await fetchAPICat3All();
        }, []);
        ////////////////////////Rechercher/////////////



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

        const getDataPdf = async (e) => {
            e.preventDefault();
            let idUser = parseInt("" + localStorage.getItem("utilisateur"));
            fetch(lien.url + "action/generate-pdf/" + idUser)
                .then(res => res.blob())
                .then(blob => {
                    var file = window.URL.createObjectURL(blob);
                    window.location.assign(file);
                });
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
            if (window.confirm("Êtes-vous sûr de vouloir supprimer cette donnée ?")) {
                try {
                    setMessageDelete("");
                    let idTodo = parseInt(data, 10);
                    let str = "" + localStorage.getItem('jwt');

                    const response = await fetch(
                        `${lien.url}action/${idTodo}`,
                        {
                            method: "DELETE",
                            body: JSON.stringify({ jwt: str }),
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    if (response.ok) {
                        setMessageDelete("Valeur supprimée");
                        await fetchApiCAtegorie(); // Met à jour les catégories après suppression
                    } else {
                        const errorMessage = await response.text();
                        console.error("Erreur lors de la suppression :", errorMessage);
                        setMessageDelete("Échec de la suppression !");
                    }
                } catch (error) {
                    console.error("Erreur réseau :", error);
                    setMessageDelete("Erreur réseau !");
                }
            } else {
                setMessageDelete("Suppression annulée !");
            }
        }, [lien.url, fetchApiCAtegorie]);

        //////////////////////insert tache
        let fetchCreer = useCallback(async (e) => {
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


            await setMessageAjout("Ajout de " + montant + " categorie " + actionCategorie + " description " + actionDescription)

        });
        ////////////////////update////////////
        let fetchAPIupdate = useCallback(async () => {
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

            await fetchAPICat3All();
            await fetchAPIToutCategorie();
            await fetchAPICat3();
            await fetchApiCAtegorieAll();
            await fetchAPI();
            await fetchApiCAtegorie();
            await fetchAPIupdate();
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
            await fetchAPIupdate();
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
        let deleteMontant = async (e) => {
            e.preventDefault();
            await fetchdelete(idMontant);
            setValue("");
            await fetchAPIToutCategorie();
            await fetchAPI();
            await fetchAPICat3();
            await fetchApiCAtegorie();
            await fetchApiCAtegorieAll();
            await fetchAPICat3All();

        };

        let deleteMontantById = async (e, id) => {
            e.preventDefault();
            await fetchdelete(id);
            setValue("");
            await fetchAPIToutCategorie();
            await fetchAPI();
            await fetchAPICat3();
            await fetchApiCAtegorie();
            await fetchApiCAtegorieAll();
            await fetchAPICat3All();

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


        }

        /////////////////////////
        return <div>
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
                    <div>

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
                    <div>

                    </div>

                </div>
            </div>}
            <div className="containerButton principaleDiv">

                <div className="containerCote">
                    <div className="containerButton">

                        <label>Filtre de l'année</label>
                        <input type="number" placeholder="Annee" value={year}
                               onChange={async (e) => {
                                   await setYear("" + e.target.value)
                                   await localStorage.setItem("year", e.target.value)
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
                            await setListDesDepense(listDesDepense.filter(value => value.dateTransaction.split("-")[0] == year).filter(value => value.description.includes(descriptionFiltre)))
                            await setMontantTotal(listDesDepense.filter(value => value.description.includes(descriptionFiltre)).filter(value => value.dateTransaction.split("-")[0] == year).map(value => value.montant).reduce(function (a, b) {
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
                            await setListDesDepense(listDesDepense.filter(value => value.dateTransaction.split("-")[0] == year).filter(value => +value.montant > +montantFiltre))
                            await setMontantTotal(listDesDepense.filter(value => value => +value.montant > +montantFiltre).filter(value => value.dateTransaction.split("-")[0] == year).map(value => value.montant).reduce(function (a, b) {
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
                            await setListDesDepense(listDesDepense.filter(value => value.dateTransaction.split("-")[0] == year).filter(value => +value.montant < +montantFiltre2))
                            await setMontantTotal(listDesDepense.filter(value => value => +value.montant < +montantFiltre2).filter(value => value.dateTransaction.split("-")[0] == year).map(value => value.montant).reduce(function (a, b) {
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
                                <BiCategory style={{ color: 'blueviolet'}}/>
                            </button>
                            <p className={categorieCSS}>{actionCategorie}</p>

                            <p className="error">{actionCategorieError}</p>
                        </div>
                    </div>
                    <div className="containerButton">
                        <button className="raise" onClick={toggleDescription}>
                            Ajouter une description
                            <MdOutlineDescription style={{ color: 'blueviolet'}}/>

                        </button>


                    </div>

                    <div className="containerCote containerButton">
                        <button className="raise" onClick={toggleMontant}>Ajouter un montant
                            <RiPassPendingLine style={{ color: 'blueviolet'}}/>
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
                            <button className="raise" onClick={fetchCreer}>creer <GrAddCircle
                                style={{ color: 'blueviolet'}}/></button>
                            <div>{messageAjout}</div>
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