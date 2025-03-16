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
        <div>
            <div style={{color: "black"}}>{messageAjout}</div>
            {modalDescription && (
                <div className="modal">
                    <div onClick={toggleDescription} className="overlay"></div>
                    <div className="modal-content containerButton">
                        <h1>Description</h1>
                        <div>
                            <input
                                placeholder="Description"
                                value={actionDescription}
                                onChange={(e) => setActionDescription(e.target.value)}
                            />{" "}
                            <p className="error">{actionDescriptionError}</p>
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
                            <input
                                type="number"
                                value={montant}
                                onChange={(e) => setMontant(e.target.value)}
                            />{" "}
                            <p className={montantCSS + " " + "error"}>{montant}</p>
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
                            {catAll.map((option) => (
                                <h1
                                    className="but1"
                                    onClick={() => setIdCat(option)}
                                    key={option.id}
                                >
                                    {option.id + " " + option.categorie}
                                </h1>
                            ))}
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
                            <div style={{color: 'black'}}>
                                <div>{datePick.toLocaleString("zh-CN", {timeZone: 'Europe/Paris'})}</div>
                                <Calendar
                                    onChange={onChangeDatePick}
                                    value={datePick}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="containerButton principaleDiv">
                <div className="containerCote">
                    <div className="containerButton">
                        <label>Filtre de l'année</label>
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
                        {year}

                        <label role="mois">Filtre par mois</label>
                        <select
                            role="select_mois"
                            onChange={async (e) => {
                                await filterByMonth(e.target.value);
                                let month = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
                                localStorage.setItem("month", "" + (month.indexOf(e.target.value) + 1));
                                fetchApiCAtegorie();
                            }}
                            className='form-select'
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

                        <button
                            className="button-85"
                            role="button"
                            onClick={resetFilters}
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>

                    <div className="containerButton">
                        <label>Filtre de Description</label>
                        <input
                            placeholder="Description"
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
                    </div>

                    <div className="containerButton">
                        <label>Filtre de montant supérieur à:</label>
                        <input
                            type="number"
                            placeholder="Montant supérieur à"
                            value={montantFiltre}
                            onChange={(e) => {
                                const newValue = parseInt(e.target.value || "0");
                                setMontantFiltre(newValue);

                                // Application immédiate du filtre
                                const filtered = listDesDepense
                                    .filter(value => value.dateTransaction.split("-")[0] == year)
                                    .filter(value => parseFloat(value.montant) > newValue);

                                setListDesDepense(filtered);

                                const total = filtered
                                    .reduce((a, b) => a + parseFloat(b.montant || 0), 0);

                                setMontantTotal(total);
                            }}
                        />
                    </div>

                    <div className="containerButton">
                        <label>Filtre de montant inférieur à:</label>
                        <input
                            type="number"
                            placeholder="Montant inférieur à"
                            value={montantFiltre2}
                            onChange={(e) => {
                                const newValue = parseInt(e.target.value || "0");
                                setMontantFiltre2(newValue);

                                // Application immédiate du filtre
                                const filtered = listDesDepense
                                    .filter(value => value.dateTransaction.split("-")[0] == year)
                                    .filter(value => parseFloat(value.montant) < newValue);

                                setListDesDepense(filtered);

                                const total = filtered
                                    .reduce((a, b) => a + parseFloat(b.montant || 0), 0);

                                setMontantTotal(total);
                            }}
                        />
                    </div>

                    <div className="containerButton">
                        <label>Filtre de Categorie</label>
                        <input
                            placeholder="Categorie"
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

                <div className="containerCote">
                    <div className="containerCote">
                        <button
                            className="button-85"
                            role="button"
                            onClick={() => {
                                setBudgetCSS(prev => prev === "visible" ? "hidden" : "visible");
                            }}
                        >
                            Ajouter un budget
                            <RiMoneyEuroCircleFill style={{color: 'blueviolet'}}/>
                        </button>
                        <input
                            className={budgetCSS}
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                        />
                        <p className={budgetCSS}></p>
                    </div>

                    <div>
                        <div className="cache">
                            <input
                                value={idMontant}
                                onChange={(e) => setIdMontant(e.target.value)}
                            />{" "}
                        </div>
                        <div className="containerButton">
                            <button
                                className="button-85"
                                role="button"
                                onClick={toggleCategorie}
                            >
                                Ajouter une categorie
                                <BiCategory style={{color: 'blueviolet'}}/>
                            </button>
                            <p className={categorieCSS}>{actionCategorie}</p>
                            <p className="error">{actionCategorieError}</p>
                        </div>
                    </div>

                    <div className="containerButton">
                        <button
                            className="button-85"
                            role="button"
                            onClick={toggleDescription}
                        >
                            Ajouter une description
                            <MdOutlineDescription style={{color: 'blueviolet'}}/>
                        </button>
                    </div>

                    <div className="containerCote containerButton">
                        <button
                            className="button-85"
                            role="button"
                            onClick={toggleMontant}
                        >
                            Ajouter un montant
                            <RiPassPendingLine style={{color: 'blueviolet'}}/>
                        </button>
                    </div>

                    <button
                        className="button-85"
                        role="button"
                        onClick={toggleDate}
                    >
                        Ajouter une date
                        <CiCalendarDate/>
                    </button>
                </div>

                <button
                    className="button-85"
                    role="button"
                    onClick={(e) => {
                        e.preventDefault();
                        setbuttonCSS(prev => prev === "visible" ? "hidden" : "visible");
                    }}
                >
                    Acceder aux bouttons
                </button>

                <div style={{"margin": "10px"}}>
                    <div className={buttonCSS}>
                        <div className="containerCote">
                            <button
                                className="button-85"
                                role="button"
                                onClick={apiCreate}
                            >
                                creer <GrAddCircle style={{color: 'blueviolet'}}/>
                            </button>
                            <button
                                className="button-85"
                                role="button"
                                onClick={getData}
                            >
                                Download
                            </button>
                            <button
                                className="button-85"
                                role="button"
                                onClick={getDataPdf}
                            >
                                Download PDF Bilan
                            </button>
                            <button
                                className="button-85"
                                role="button"
                                onClick={getDataPdfCategorie}
                            >
                                DownloadPDF Bilan Categorie
                            </button>
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

                    <h1>
                        Nombre de dépense: {
                        listDesDepense
                            .filter(value => value?.dateTransaction?.split("-")[0] === year)
                            ?.length
                    }
                    </h1>

                    <div style={{margin: "10px"}}>
                        <h1>
                            Depense en cours: {
                            textCat2
                                .map(val => parseFloat(val.montant || 0))
                                .reduce((a, b) => a + b, 0)
                        }
                        </h1>
                    </div>

                    <div style={{margin: "10px"}}>
                        <h1>
                            Budget: {
                            textCat2
                                .map(val => parseFloat(val.budgetDebutMois || 0))
                                .reduce((a, b) => a + b, 0)
                        }
                        </h1>
                    </div>

                    <div style={{margin: "10px"}}>
                        <h1>
                            Reste à dépenser: {
                            textCat2
                                .map(val => parseFloat(val.budgetDebutMois || 0))
                                .reduce((a, b) => a + b, 0) -
                            textCat2
                                .map(val => parseFloat(val.montant || 0))
                                .reduce((a, b) => a + b, 0)
                        }
                        </h1>
                    </div>

                    <div className="containerCote">
                        {textCat2?.length > 0 ? textCat2.map(value => (
                            <div key={value.categorie} style={{color: 'black', padding: "10px"}}>
                                <h2 style={{color: 'blue', marginBottom: '5px'}}>{value.categorie}</h2>
                                <div
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        backgroundColor: value.color || "#cccccc"
                                    }}
                                ></div>
                                <h2 style={{color: 'black'}}>
                                    Debut mois: {value.budgetDebutMois}
                                </h2>
                                <h2 style={{color: 'black'}}>
                                    En cours: {value.montant}
                                </h2>
                                <h2 style={{color: 'black'}}>
                                    Montant restant: {
                                    parseFloat(value.budgetDebutMois || 0) -
                                    parseFloat(value.montant || 0)
                                }
                                </h2>
                            </div>
                        )) : null}
                    </div>
                </div>
            </div>

            <button
                className="button-85"
                role="button"
                onClick={downloadPDF}
            >
                dl pdf
            </button>

            <ProgressBar
                className={budgetCSS}
                completed={calcul()}
            />

            <div style={{padding: "15px"}} className="containerButton"></div>

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
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {listDesDepense
                        .filter(value => value.dateTransaction.split("-")[0] === year)
                        .map((item) => (
                            <tr
                                key={item.id}
                                onClick={() => {
                                    setIdMontant(item.id);
                                    setMontant(item.montant);
                                    setActionDescription(item.description);
                                }}
                            >
                                <th>{item.id}</th>
                                <th className="montant">{item.montant}</th>
                                <th style={{color: "white"}}>{item.description}</th>
                                <th style={{color: "white"}}>{item.categorieId}</th>
                                <th style={{color: "white"}}>{item.dateTransaction}</th>
                                <th style={{color: "white"}}>{item.dateAjout}</th>
                                <th style={{color: "white"}}>{item.categorie}</th>
                                <th>
                                        <span
                                            className="span-supprimer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteMontantById(e, item.id);
                                            }}
                                        >
                                            Supprimer
                                        </span>
                                </th>
                            </tr>
                        ))
                    }
                    </tbody>
                    <tfoot>
                    <tr>
                        <th scope="row" colSpan="2"></th>
                        <td colSpan="2">montantTotal: {montantTotal}</td>
                        <td colSpan="2">Nombre de dépense: {listDesDepense?.length}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}