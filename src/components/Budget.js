import React, {useCallback, useEffect, useRef, useState} from 'react';
import lien from './lien'
import Calendar from 'react-calendar';
import GraphParDate from "./GraphParDate";
import ProgressBar from "@ramonak/react-progress-bar";
import {RiPassPendingLine} from "react-icons/ri";
import {BiCategory} from "react-icons/bi";
import {CiCalendarDate} from "react-icons/ci";
import {GrAddCircle} from "react-icons/gr";
import {MdOutlineDescription} from "react-icons/md";
import BarGraph from "./BarGraph";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import './css/budget_style.css';
import {useNotify} from "../Notification";

export function Budget(props) {
    const [actionDescription, setActionDescription] = useState("");
    const [idMontant, setIdMontant] = useState(-1);
    const [montant, setMontant] = useState(0);
    const [actionCategorieError, setActionCategorieError] = useState("");
    const [actionCategorie, setActionCategorie] = useState("");
    const [actionDescriptionError, setActionDescriptionError] = useState("");
    const [valueInput, setValue] = useState("");
    const [valueInputDescription, setDescription] = useState("");
    const [listDesDepense, setListDesDepense] = useState([]);
    const [descriptionFiltre, setDescriptionFiltre] = useState("");
    const [montantTotal, setMontantTotal] = useState(0);
    const [textCat2, setTextCat2] = useState([]);
    const [tousLesMois, settousLesMois] = useState([]);
    const [tousLesMoisAll, settousLesMoisAll] = useState([]);
    const [load, setLoad] = useState(false);
    const [datePick, onChangeDatePick] = useState(new Date());
    const [montantCSS, setMontantCSS] = useState("hidden");
    const [budget, setBudget] = useState(0);
    const [budgetCSS, setBudgetCSS] = useState("hidden");
    const [categorieCSS, setCategorieCSS] = useState("hidden");
    const [dateCSS, setDateCSS] = useState("hidden");
    const [buttonCSS, setbuttonCSS] = useState("hidden");
    const [messageAjout, setMessageAjout] = useState("");
    const [messageModif, setMessageModif] = useState("");
    const [messageDelete, setMessageDelete] = useState("");
    const [categorieFiltre, setCategorieFiltre] = useState("");
    const [modalDescription, setModalDescription] = useState(false);
    const [modalCategorie, setModalCategorie] = useState(false);
    const [modalMontant, setModalMontant] = useState(false);
    const [modalDate, setModalDate] = useState(false);
    const [year, setYear] = useState("2023");
    const [catAll, setCatAll] = useState([]);
    const [textCatAll, setCat2All] = useState([]);
    const [montantFiltre, setMontantFiltre] = useState(0);
    const [montantFiltre2, setMontantFiltre2] = useState(0);
    const [isEditingMinMontant, setIsEditingMinMontant] = useState(false);
    const [isEditingMaxMontant, setIsEditingMaxMontant] = useState(false);


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
        labels: listDesDepense.filter(value => value.dateTransaction.split("-")[0] === year).map(value => value.description + "" + value.dateTransaction),
        datasets: [{
            label: "Depense par date",
            backgroundColor: 'pink',
            borderColor: 'red',
            fill: false,
            data: listDesDepense.filter(value => value.dateTransaction.split("-")[0] === year).map(value => {
                return {x: value.dateTransaction, y: value?.montant}
            }),
        }]
    };

    const apiMonthByCategory = useCallback(async () => {
        let idUser = parseInt(localStorage.getItem("utilisateur") || "0");
        let getyear = parseInt(localStorage.getItem("year") || "0");
        let token = localStorage.getItem("jwt");

        if (isNaN(getyear)) return;

        const baseUrl = `${lien.url}action/categorie/sum/byUser/${idUser}`;

        try {
            // Création d'un tableau de promesses pour récupérer les données des 12 mois
            const requests = Array.from({length: 12}, (_, index) =>
                fetch(`${baseUrl}/${index + 1}/${getyear}`, {Authorization: `Bearer ${token}`}).then(res => res.json())
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
            let idUser = parseInt(localStorage.getItem("utilisateur") || "0", 10);
            let getyear = parseInt(localStorage.getItem("year") || "0", 10) || 2023;
            let token = localStorage.getItem("jwt");

            if (isNaN(idUser) || isNaN(getyear)) return;

            let requests = Array.from({length: 12}, (_, i) =>
                fetch(`${lien.url}action/montant/sum/byUser/${idUser}/${i + 1}/${getyear}`, {
                    Authorization: `Bearer ${token}`
                }).then(res => res.json())
            );

            let tousMois = await Promise.all(requests);

            console.log(tousMois);
            settousLesMoisAll(tousMois);

            return tousMois;
        } catch (error) {
            console.error("Erreur lors de la récupération des montants :", error);
        }
    }, [settousLesMoisAll]);

    const fetchApiCAtegorie = useCallback(async () => {
        try {
            let getyear = parseInt(localStorage.getItem("year") || "0");
            if (isNaN(getyear)) {
                return;
            }
            let str = localStorage.getItem("month");
            let idUser = parseInt(localStorage.getItem("utilisateur") || "0");
            let token = localStorage.getItem("jwt");

            if (!str || isNaN(idUser)) return;

            const response = await fetch(`${lien.url}action/categorie/sum/byUser/${idUser}/${str}/${getyear}`,
                {Authorization: `Bearer ${str}`});

            const resbis = await response.json();
            setTextCat2(resbis);

            return resbis;
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories :", error);
        }
    }, [setTextCat2]);

    const apiCategorieAllYear = useCallback(async () => {
        try {
            let idUser = parseInt(localStorage.getItem("utilisateur") || "0", 10);

            if (isNaN(idUser)) return;

            const response = await fetch(`${lien.url}action/categorie/sum/all/${idUser}`);
            const resbis = await response.json();

            setCat2All(resbis);
            return resbis;
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories :", error);
        }
    }, [setCat2All]);

    const attendre = () => {
        setLoad(true);
        setTimeout(() => {
            setLoad(false);
        }, 2000);
        console.log(load);
    };

    useEffect(() => {
        const initApp = async () => {
            attendre();
            await localStorage.setItem("year", "2023");

            await fetchAPIToutCategorie();
            await fetchAPI();
            await apiMonthByCategory();
            await fetchApiCAtegorie();
            await apiCategorieAllYear();
            await apiMonthAll();
        };

        initApp();
    }, []);

    async function filterByMonth(monthNum) {
        let month = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];

        let tout = await fetchAPI().then(value => value.filter(value2 => (value2.dateTransaction.toString().split("-")[1]) == (month.indexOf(monthNum) + 1)));

        setListDesDepense(await fetchAPI().then(value => value.filter(value2 => (value2.dateTransaction.toString().split("-")[1]) == (month.indexOf(monthNum) + 1))));

        setMontantTotal(tout.filter(value => value.dateTransaction.split("-")[0] == year).map(val => val.montant).reduce(function (a, b) {
            return a + b;
        }, 0));
    }

    const fetchAPIToutCategorie = useCallback(async () => {
        try {
            let idUser = parseInt(localStorage.getItem("utilisateur") || "0");

            if (isNaN(idUser)) return;

            const response = await fetch(lien.url + "categorie/byuser/" + idUser);
            const resbis = await response.json();
            setCatAll(resbis);

            return resbis;
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories :", error);
        }
    }, [setCatAll]);

    const fetchAPI = useCallback(async () => {
        try {
            let idUser = parseInt(localStorage.getItem("utilisateur") || "0");

            if (isNaN(idUser)) return [];

            const response = await fetch(lien.url + "action/byuser/" + idUser);
            const resbis = await response.json();
            setListDesDepense(resbis);

            const yearFiltered = resbis.filter(value => value.dateTransaction.split("-")[0] === year);
            const total = yearFiltered.reduce((a, b) => a + (parseFloat(b.montant) || 0), 0);

            setMontantTotal(total);

            return resbis;
        } catch (error) {
            console.error("Erreur lors de la récupération des actions :", error);
            return [];
        }
    }, [setListDesDepense, year]);

    const getData = async (e) => {
        e.preventDefault();
        try {
            let idUser = parseInt(localStorage.getItem("utilisateur") || "0");

            if (isNaN(idUser)) return;

            fetch(lien.url + "action/export/" + idUser)
                .then(res => res.blob())
                .then(blob => {
                    var file = window.URL.createObjectURL(blob);
                    window.location.assign(file);
                });
            notify("Teléchargement", 'success');
        } catch (error) {
            console.error("Erreur lors du téléchargement :", error);
            notify("Erreur lors du téléchargement", 'error');
        }
    }

    const getDataPdf = async (e) => {
        e.preventDefault();
        try {
            let idUser = parseInt(localStorage.getItem("utilisateur") || "0");

            if (isNaN(idUser)) return;

            fetch(lien.url + "action/generate-pdf/" + idUser)
                .then(res => res.blob())
                .then(blob => {
                    var file = window.URL.createObjectURL(blob);
                    window.location.assign(file);
                });
            notify("Teléchargement du pdf", 'success');
        } catch (error) {
            console.error("Erreur lors du téléchargement :", error);
            notify("Erreur lors du téléchargement", 'error');
        }
    }

    const getDataPdfCategorie = async (e) => {
        e.preventDefault();
        try {
            let idUser = parseInt(localStorage.getItem("utilisateur") || "0");

            if (isNaN(idUser)) return;

            fetch(lien.url + "action/generateAll-categorie-bilan/" + idUser)
                .then(res => res.blob())
                .then(blob => {
                    var file = window.URL.createObjectURL(blob);
                    window.location.assign(file);
                });
            notify("Teléchargement du pdf", 'success');
        } catch (error) {
            console.error("Erreur lors du téléchargement :", error);
            notify("Erreur lors du téléchargement", 'error');
        }
    }

    useEffect(() => {
        fetchAPI();
    }, [fetchAPI]);

    const del = (e, data) => {
        e.preventDefault();
        fetchdelete(data);
    };

    const fetchdelete = useCallback(async (data) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette donnée ?")) {
            try {
                setMessageDelete("");
                let idTodo = parseInt(data, 10);
                let str = "" + localStorage.getItem('jwt');

                if (isNaN(idTodo)) return;

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
                    await fetchApiCAtegorie();
                    notify("Valeur supprimée", 'success');
                } else {
                    const errorMessage = await response.text();
                    console.error("Erreur lors de la suppression :", errorMessage);
                    setMessageDelete("Échec de la suppression !");
                    notify("Erreur", 'error');
                }
            } catch (error) {
                console.error("Erreur réseau :", error);
                setMessageDelete("Erreur réseau !");
                notify("Erreur reseau", 'error');
            }
        } else {
            setMessageDelete("Suppression annulée !");
            notify("Suppression annulée", 'error');
        }
    }, [lien.url, fetchApiCAtegorie, notify]);

    const apiCreate = useCallback(async (e) => {
        e.preventDefault();
        try {
            let str = "" + localStorage.getItem('jwt');
            let userId = parseInt(localStorage.getItem("utilisateur") || "0");

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

            notify("Ajout de " + montant + " categorie " + actionCategorie + " description " + actionDescription, 'success');
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
            notify("Erreur lors de l'ajout", 'error');
        }
    }, [actionDescription, actionCategorie, montant, datePick, lien.url, notify]);

    const apiUpdate = useCallback(async () => {
        setMessageModif("");
        try {
            let str = "" + localStorage.getItem('jwt');

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
            setMessageModif("Valeur modifiée");
            fetchApiCAtegorie();
        } catch (error) {
            console.error("Erreur lors de la modification :", error);
            notify("Erreur lors de la modification", 'error');
        }
    }, [idMontant, actionCategorie, actionDescription, montant, datePick, lien.url,
        apiMonthAll, fetchAPIToutCategorie, apiMonthByCategory, apiCategorieAllYear,
        fetchAPI, fetchApiCAtegorie, notify]);

    const Valuechange = (e) => {
        let a = e.target.value;
        console.log(a);

        if (valueInput.length > 20) {
            // Logique originale laissée vide
        } else {
            // Logique originale laissée vide
        }

        setValue(a);
        return a;
    };

    // Pour réinitialiser les filtres et récupérer toutes les données
    const resetFilters = async () => {
        setDescriptionFiltre("");
        setMontantFiltre(0);
        setMontantFiltre2(0);
        setCategorieFiltre("");

        const allData = await fetchAPI();
        setListDesDepense(allData);

        const yearFiltered = allData.filter(value => value.dateTransaction.split("-")[0] == year);
        const total = yearFiltered.reduce((a, b) => a + parseFloat(b.montant || 0), 0);
        setMontantTotal(total);
    };

    const modifier = async (e) => {
        e.preventDefault();
        await apiUpdate();
        setValue("");
    };

    // Fonction correctement mise à jour pour la comparaison "==="
    const calcul = () => {
        if (montantTotal !== 0) {
            if (budget !== 0) {
                return ((montantTotal * 100) / budget);
            } else {
                return 1;
            }
        } else {
            return 0;
        }
    };

    const setIdCat = (option) => {
        setActionCategorie(option.id);
        notify("Catégorie sélectionnée \n" + option.categorie, 'success');
    };

    const deleteMontant = async (e) => {
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

    const deleteMontantById = async (e, id) => {
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

    const pdfref = useRef();

    const downloadPDF = () => {
        const input = pdfref.current;
        if (!input) return;

        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a5', true);

            // doc and image dimensions
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 1;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save('Garph.pdf');
        });
        notify("Teléchargement du pdf", 'success');
    };

    return (
        <div className="expense-tracker">
            {/* Status notification */}
            {messageAjout && <div className="notification success">{messageAjout}</div>}

            {/* App Header */}
            <header className="app-header">
                <h1>Gestionnaire des Dépenses</h1>
                <p className="subtitle">Suivez et gérez facilement votre budget</p>
            </header>

            {/* Main content area */}
            <main className="app-content">
                {/* Filters and Controls Panel */}
                <section className="panel filters-panel">
                    <h2 className="panel-title">Filtres</h2>

                    <div className="panel-grid">
                        {/* Year and Month Filters */}
                        <div className="filter-group">
                            <label>Année</label>
                            <div className="input-with-value">
                                <input
                                    type="number"
                                    placeholder="Année"
                                    value={year}
                                    onChange={async (e) => {
                                        const newYear = e.target.value;
                                        setYear(newYear);
                                        localStorage.setItem("year", newYear);

                                        // Réappliquer les filtres avec la nouvelle année
                                        const data = await fetchAPI();
                                        const filtered = data.filter(value => value.dateTransaction.split("-")[0] == newYear);
                                        setListDesDepense(filtered);

                                        const total = filtered.reduce((a, b) => a + parseFloat(b.montant || 0), 0);
                                        setMontantTotal(total);
                                    }}
                                />
                                <span className="current-value">{year}</span>
                            </div>

                            <label role="mois">Mois</label>
                            <select
                                role="select_mois"
                                onChange={async (e) => {
                                    await filterByMonth(e.target.value);
                                    let month = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
                                    localStorage.setItem("month", "" + (month.indexOf(e.target.value) + 1));
                                    fetchApiCAtegorie();
                                }}
                                className='custom-select'
                            >
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

                        {/* Other Filters */}
                        <div className="filter-group">
                            <label>Description</label>
                            <input
                                placeholder="Rechercher une description"
                                value={descriptionFiltre}
                                onChange={(e) => {
                                    setDescriptionFiltre(e.target.value);
                                    // Application immédiate du filtre
                                    const filtered = listDesDepense
                                        .filter(value => value.dateTransaction.split("-")[0] == year)
                                        .filter(value => value.description.includes(e.target.value));

                                    setListDesDepense(filtered);

                                    const total = filtered
                                        .reduce((a, b) => a + parseFloat(b.montant || 0), 0);

                                    setMontantTotal(total);
                                }}
                            />

                            <label>Montant supérieur à</label>
                            <input
                                type="number"
                                placeholder="Valeur minimum"
                                value={montantFiltre === 0 && isEditingMinMontant ? "" : montantFiltre}
                                onFocus={() => setIsEditingMinMontant(true)}
                                onBlur={() => setIsEditingMinMontant(false)}
                                onChange={(e) => {
                                    // Permettre les champs vides qui seront traités comme zéro
                                    const newValue = e.target.value === "" ? 0 : parseFloat(e.target.value);
                                    setMontantFiltre(newValue);

                                    // Application immédiate du filtre
                                    const data = [...listDesDepense]; // Créer une copie pour éviter de modifier l'état directement
                                    const filtered = data
                                        .filter(value => value.dateTransaction.split("-")[0] == year)
                                        .filter(value =>
                                            // Si le champ est vide, n'appliquez pas de filtre minimum
                                            e.target.value === "" || parseFloat(value.montant) > newValue
                                        );

                                    setListDesDepense(filtered);

                                    const total = filtered
                                        .reduce((a, b) => a + parseFloat(b.montant || 0), 0);

                                    setMontantTotal(total);
                                }}
                            />


                            <label>Montant inférieur à</label>
                            <input
                                type="number"
                                placeholder="Valeur maximum"
                                value={montantFiltre2 === 0 && isEditingMaxMontant ? "" : montantFiltre2}
                                onFocus={() => setIsEditingMaxMontant(true)}
                                onBlur={() => setIsEditingMaxMontant(false)}
                                onChange={(e) => {
                                    // Permettre les champs vides qui seront traités comme zéro
                                    const newValue = e.target.value === "" ? 0 : parseFloat(e.target.value);
                                    setMontantFiltre2(newValue);

                                    // Application immédiate du filtre
                                    const data = [...listDesDepense]; // Créer une copie pour éviter de modifier l'état directement
                                    const filtered = data
                                        .filter(value => value.dateTransaction.split("-")[0] == year)
                                        .filter(value =>
                                            // Si le champ est vide ou zéro, n'appliquez pas de filtre maximum
                                            e.target.value === "" || newValue === 0 || parseFloat(value.montant) < newValue
                                        );

                                    setListDesDepense(filtered);

                                    const total = filtered
                                        .reduce((a, b) => a + parseFloat(b.montant || 0), 0);

                                    setMontantTotal(total);
                                }}
                            />
                        </div>
                        <div className="filter-group">
                            <label>Catégorie</label>
                            <input
                                placeholder="Rechercher une catégorie"
                                value={categorieFiltre}
                                onChange={(e) => {
                                    setCategorieFiltre(e.target.value);

                                    // Application immédiate du filtre
                                    const filtered = listDesDepense
                                        .filter(value => value.categorie.includes(e.target.value));

                                    setListDesDepense(filtered);

                                    const total = filtered
                                        .filter(value => value.dateTransaction.split("-")[0] == year)
                                        .reduce((a, b) => a + parseFloat(b.montant || 0), 0);

                                    setMontantTotal(total);
                                }}
                            />
                        </div>
                    </div>
                    <button
                        className="btn"
                        onClick={resetFilters}
                    >
                        Réinitialiser les filtres
                    </button>
                </section>

                {/* Actions Panel */}
                <section className="panel actions-panel">
                    <h2 className="panel-title">Ajouter une dépense</h2>

                    <div className="panel-grid">

                        {/* Category Button */}
                        <div className="action-group">
                            <div className="hidden">
                                <input
                                    value={idMontant}
                                    onChange={(e) => setIdMontant(e.target.value)}
                                />
                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={toggleCategorie}
                            >
                                <BiCategory className="icon"/>
                                <span>Catégorie</span>
                            </button>

                            {actionCategorie && (
                                <div className="selected-value">
                                    <span>Catégorie sélectionnée:</span>
                                    <strong>{actionCategorie}</strong>
                                </div>
                            )}

                            {actionCategorieError && (
                                <p className="error-text">{actionCategorieError}</p>
                            )}
                        </div>

                        {/* Description Button */}
                        <div className="action-group">
                            <button
                                className="btn btn-primary"
                                onClick={toggleDescription}
                            >
                                <MdOutlineDescription className="icon"/>
                                <span>Description</span>
                            </button>

                            {actionDescription && (
                                <div className="selected-value">
                                    <span>Description:</span>
                                    <strong>{actionDescription}</strong>
                                </div>
                            )}
                        </div>

                        {/* Amount Button */}
                        <div className="action-group">
                            <button
                                className="btn btn-primary"
                                onClick={toggleMontant}
                            >
                                <RiPassPendingLine className="icon"/>
                                <span>Montant</span>
                            </button>

                            {montant > 0 && (
                                <div className="selected-value">
                                    <span>Montant:</span>
                                    <strong>{montant}</strong>
                                </div>
                            )}
                        </div>

                        {/* Date Button */}
                        <div className="action-group">
                            <button
                                className="btn btn-primary"
                                onClick={toggleDate}
                            >
                                <CiCalendarDate className="icon"/>
                                <span>Date</span>
                            </button>

                            <div className="selected-value">
                                <span>Date sélectionnée:</span>
                                <strong>{datePick.toLocaleDateString()}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button
                            className="btn btn-secondary toggle-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                setbuttonCSS(prev => prev === "visible" ? "hidden" : "visible");
                            }}
                        >
                            {buttonCSS === "visible" ? "Masquer les options" : "Afficher les options"}
                        </button>

                        <div className={buttonCSS === "visible" ? "expanded-buttons" : "hidden"}>
                            <button
                                className="btn btn-success"
                                onClick={apiCreate}
                            >
                                <GrAddCircle className="icon"/>
                                <span>Créer</span>
                            </button>

                            <button
                                className="btn btn-info"
                                onClick={getData}
                            >
                                <span>Télécharger</span>
                            </button>

                            <button
                                className="btn btn-info"
                                onClick={getDataPdf}
                            >
                                <span>PDF Bilan</span>
                            </button>

                            <button
                                className="btn btn-info"
                                onClick={getDataPdfCategorie}
                            >
                                <span>PDF Catégories</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Data Visualization Section */}
                <section className="panel chart-panel">
                    <h2 className="panel-title">Graphique des dépenses</h2>
                    <div className="chart-container">
                        <GraphParDate data={dataParDate}></GraphParDate>
                    </div>
                </section>

                {/* PDF Report Section */}
                <div ref={pdfref} className="pdf-content">
                    <section className="panel chart-panel">
                        <h2 className="panel-title">Dépenses par catégorie (Mois {localStorage.getItem("month")})</h2>
                        <div className="chart-container">
                            <BarGraph data={data}></BarGraph>
                        </div>
                    </section>


                    {/* Summary Section */}
                    <section className="panel summary-panel">
                        <h2 className="panel-title">Résumé Financier</h2>

                        <div className="summary-grid">
                            <div className="summary-card">
                                <div className="summary-label">Mois</div>
                                <div className="summary-value">{localStorage.getItem("month")}</div>
                            </div>

                            <div className="summary-card">
                                <div className="summary-label">Montant Total</div>
                                <div className="summary-value highlight">{montantTotal}</div>
                            </div>

                            <div className="summary-card">
                                <div className="summary-label">Nombre de dépenses</div>
                                <div className="summary-value">
                                    {listDesDepense.filter(value => value?.dateTransaction?.split("-")[0] === year)?.length}
                                </div>
                            </div>

                            <div className="summary-card">
                                <div className="summary-label">Dépenses en cours</div>
                                <div className="summary-value highlight">
                                    {textCat2.map(val => parseFloat(val.montant || 0)).reduce((a, b) => a + b, 0)}
                                </div>
                            </div>

                            <div className="summary-card">
                                <div className="summary-label">Budget</div>
                                <div className="summary-value">
                                    {textCat2.map(val => parseFloat(val.budgetDebutMois || 0)).reduce((a, b) => a + b, 0)}
                                </div>
                            </div>

                            <div className="summary-card">
                                <div className="summary-label">Reste à dépenser</div>
                                <div className="summary-value">
                                    {textCat2.map(val => parseFloat(val.budgetDebutMois || 0)).reduce((a, b) => a + b, 0) -
                                        textCat2.map(val => parseFloat(val.montant || 0)).reduce((a, b) => a + b, 0)}
                                </div>
                            </div>
                        </div>

                        {/* Category Cards */}
                        <div className="categories-grid">
                            {textCat2?.length > 0 ? textCat2.map(value => (
                                <div key={value.categorie} className="category-card">
                                    <div className="category-header">
                                        <h3 className="category-title">{value.categorie}</h3>
                                        <div
                                            className="color-indicator"
                                            style={{
                                                backgroundColor: value.color || "#cccccc"
                                            }}
                                        ></div>
                                    </div>

                                    <div className="category-stats">
                                        <div className="stat-group">
                                            <div className="stat-label">Budget initial</div>
                                            <div className="stat-value">{value.budgetDebutMois}</div>
                                        </div>

                                        <div className="stat-group">
                                            <div className="stat-label">Dépensé</div>
                                            <div className="stat-value">{value.montant}</div>
                                        </div>

                                        <div className="stat-group">
                                            <div className="stat-label">Reste</div>
                                            <div className="stat-value">
                                                {parseFloat(value.budgetDebutMois || 0) - parseFloat(value.montant || 0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : <p className="no-data">Aucune catégorie disponible</p>}
                        </div>
                    </section>
                </div>

                {/* PDF Download Button */}
                <div className="pdf-download">
                    <button
                        className="btn btn-secondary"
                        onClick={downloadPDF}
                    >
                        Télécharger PDF
                    </button>
                </div>

                {/* Budget Progress Bar */}
                <div className={budgetCSS === "visible" ? "budget-progress" : "hidden"}>
                    <h3>Progression du budget</h3>
                    <ProgressBar
                        completed={calcul()}
                        bgColor="#4caf50"
                        height="20px"
                        labelColor="#fff"
                        borderRadius="10px"
                    />
                </div>

                {/* Expenses Table */}
                <section className="panel table-panel">
                    <h2 className="panel-title">Liste des dépenses</h2>

                    <div className="table-container">
                        <table className="expenses-table">
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Montant</th>
                                <th>Description</th>
                                <th>Catégorie Id</th>
                                <th>Catégorie</th>
                                <th>Date de la dépense</th>
                                <th>Date d'ajout</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {listDesDepense
                                .filter(value => value.dateTransaction.split("-")[0] === year)
                                .map((item) => (
                                    <tr
                                        key={item.id}
                                        className="expense-row"
                                        onClick={() => {
                                            setIdMontant(item.id);
                                            setMontant(item.montant);
                                            setActionDescription(item.description);
                                        }}
                                    >
                                        <td>{item.id}</td>
                                        <td className="amount-cell">{item.montant}</td>
                                        <td>{item.description}</td>
                                        <td>{item.categorieId}</td>
                                        <td>{item.categorie}</td>
                                        <td>{item.dateTransaction}</td>
                                        <td>{item.dateAjout}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteMontantById(e, item.id);
                                                }}
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan="2">Total: {montantTotal}</td>
                                <td colSpan="6">Nombre de
                                    dépenses: {listDesDepense.filter(value => value.dateTransaction.split("-")[0] === year).length}</td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </section>
            </main>

            {/* Modals */}
            {/* Description Modal */}
            {modalDescription && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Description</h2>
                            <button className="close-btn" onClick={toggleDescription}>×</button>
                        </div>
                        <div className="modal-body">
                            <input
                                className="modal-input"
                                placeholder="Entrez une description"
                                value={actionDescription}
                                onChange={(e) => setActionDescription(e.target.value)}
                            />
                            {actionDescriptionError && <p className="error-text">{actionDescriptionError}</p>}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={toggleDescription}>Valider</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Amount Modal */}
            {modalMontant && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Montant</h2>
                            <button className="close-btn" onClick={toggleMontant}>×</button>
                        </div>
                        <div className="modal-body">
                            <input
                                className="modal-input"
                                type="number"
                                placeholder="Entrez un montant"
                                value={montant}
                                onChange={(e) => setMontant(e.target.value)}
                            />
                            {montant > 0 && <div className="amount-preview">{montant}</div>}
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={toggleMontant}>Valider</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {modalCategorie && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Catégorie</h2>
                            <button className="close-btn" onClick={toggleCategorie}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="categories-list">
                                {catAll.map((option) => (
                                    <button
                                        className="category-option"
                                        onClick={() => {
                                            setIdCat(option);
                                            toggleCategorie();
                                        }}
                                        key={option.id}
                                    >
                                        {option.categorie}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Date Modal */}
            {modalDate && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Date</h2>
                            <button className="close-btn" onClick={toggleDate}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="calendar-container">
                                <div className="selected-date">
                                    {datePick.toLocaleDateString()}
                                </div>
                                <Calendar
                                    onChange={onChangeDatePick}
                                    value={datePick}
                                    className="date-picker"
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={toggleDate}>Valider</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}