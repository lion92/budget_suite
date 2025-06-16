import React, {useCallback, useEffect, useState} from "react";
import Item from "./Item";
import lien from './lien'
import {Link} from "react-router-dom";
import {useNotify} from "./Notification";
import './css/form.css'
import TasksNotion from "../TasksNotion";

export default function Form(props) {
    let [titre, setValue] = useState("");
    let [valueInputTitre, setTitre] = useState("");
    let [valueInputDescription, setDescription] = useState("");
    let [idVal, setId] = useState(-1);
    let [listItem, setText] = useState([]);
    let [allItems, setAllItems] = useState([]); // Garder tous les items pour le filtrage

    const [load, setLoad] = useState(false);
    const notify = useNotify();

    // États pour les filtres
    const [filters, setFilters] = useState({
        searchTerm: "",
        sortBy: "date", // date, title, description
        sortOrder: "desc", // asc, desc
        dateFilter: "all", // all, today, week, month
        showCompleted: true,
        showIncomplete: true
    });

    let attendre = () => {
        setLoad(true);
        setTimeout(() => {
            setLoad(false);
        }, 500);
        console.log(load);
    };

    useEffect(() => {
        attendre();
    }, []);

    // Rechercher
    let recherche = async (e) => {
        e.preventDefault();
        if (titre === "") {
            console.log("test0");
            await fetchAPI();
        } else {
            let f = await fetchAPI();
            await console.log(f);
            await titre;
            let tab = await f.filter((elemt) =>
                elemt.title === titre
                || elemt.description === valueInputDescription
            );
            await setText(tab);
            await console.log("bb");
        }
    };

    // Fetch API
    const fetchAPI = useCallback(async () => {
        let idUser = parseInt("" + localStorage.getItem("utilisateur"))
        let str = "" + localStorage.getItem('jwt')
        const response = await fetch(lien.url + "todos/byuser/" + idUser ,{headers:{Authorization: `Bearer ${str}`}});
        const resbis = await response.json();
        setAllItems(resbis); // Sauvegarder tous les items
        applyFilters(resbis); // Appliquer les filtres
        return resbis;
    }, []);

    // Fonction pour appliquer les filtres
    const applyFilters = useCallback((items = allItems) => {
        let filtered = [...items];

        // Filtre de recherche
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.title?.toLowerCase().includes(searchLower) ||
                item.description?.toLowerCase().includes(searchLower)
            );
        }

        // Filtre par date
        if (filters.dateFilter !== "all") {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            filtered = filtered.filter(item => {
                const itemDate = new Date(item.createdAt);

                switch (filters.dateFilter) {
                    case "today":
                        return itemDate >= today;
                    case "week":
                        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return itemDate >= weekAgo;
                    case "month":
                        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                        return itemDate >= monthAgo;
                    default:
                        return true;
                }
            });
        }

        // Tri
        filtered.sort((a, b) => {
            let comparison = 0;

            switch (filters.sortBy) {
                case "title":
                    comparison = (a.title || "").localeCompare(b.title || "");
                    break;
                case "description":
                    comparison = (a.description || "").localeCompare(b.description || "");
                    break;
                case "date":
                default:
                    comparison = new Date(a.createdAt) - new Date(b.createdAt);
                    break;
            }

            return filters.sortOrder === "desc" ? -comparison : comparison;
        });

        setText(filtered);
    }, [filters, allItems]);

    // Effet pour appliquer les filtres quand ils changent
    useEffect(() => {
        if (allItems.length > 0) {
            applyFilters();
        }
    }, [filters, applyFilters]);

    // Fonction pour mettre à jour les filtres
    const updateFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Fonction pour réinitialiser les filtres
    const resetFilters = () => {
        setFilters({
            searchTerm: "",
            sortBy: "date",
            sortOrder: "desc",
            dateFilter: "all",
            showCompleted: true,
            showIncomplete: true
        });
    };

    // Remonter au parent
    let idchange = (data) => {
        setId(data);
    };

    // Change color
    let changeColor = (data) => {
        // Logique de changement de couleur
    };

    // Appel API au début
    useEffect(() => {
        fetchAPI();
    }, []);

    // Supprimer des tâches
    let del = (e, data) => {
        e.preventDefault();
        fetchdelete(data);
    };

    // Remonter le texte
    let textebis = (data) => {
        setValue(data);
    };

    // Remonter la description
    let textebisDesc = (data) => {
        setDescription(data);
    };

    // Appel delete
    let fetchdelete = useCallback(async (data) => {
        let idTodo = parseInt(data, 10)
        let str = "" + localStorage.getItem('jwt')
        const response = await fetch(
            lien.url + "todos/" + idTodo,
            {
                method: "DELETE",
                body: JSON.stringify({
                    jwt: str
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const resbis = await response;
        notify("Todo supprimé", 'success')
        await fetchAPI();
    });

    // Insert tâche
    let fetchCreer = useCallback(async (e) => {
        let userid = "" + localStorage.getItem("utilisateur");
        let userid2 = parseInt(userid)
        let str = "" + localStorage.getItem('jwt')
        e.preventDefault();
        const response = await fetch(
            lien.url + "todos",
            {
                method: "POST",
                body: JSON.stringify({
                    title: titre,
                    description: valueInputDescription,
                    user: userid2,
                    jwt: str
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const resbis = await response;
        notify("Todo créé", 'success')
        await fetchAPI();
    });

    // Update
    let fetchAPIupdate = useCallback(async () => {
        let userid = "" + localStorage.getItem("utilisateur");
        let str = "" + localStorage.getItem('jwt')
        await console.log(userid);
        let id = parseInt(userid);
        const response = await fetch(
            lien.url + "todos/" + idVal,
            {
                method: "PUT",
                body: JSON.stringify({
                    title: titre,
                    description: valueInputDescription,
                    user: id,
                    jwt: str
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const resbis = await response;
        notify("Todo mis à jour", 'success')
        await fetchAPI();
    });

    // Input change value - SANS LIMITES
    let Valuechange = (e) => {
        let a = e.target.value;
        console.log(a);
        setValue(a);
        return a;
    };

    // Input change description - SANS LIMITES
    let valueChangeDescription = (e) => {
        let a = e.target.value;
        console.log(a);
        setDescription(a)
        return a;
    };

    // Modifier
    let modifier = (e) => {
        e.preventDefault();
        fetchAPIupdate();
        setValue("");
        setTitre("");
        setDescription("");
    };

    return (
        <div className="form-container">

            <TasksNotion></TasksNotion>
            <div className="form-wrapper">
                {localStorage.getItem("jwt") ?
                    <div className="logout-section">
                        <Link
                            className="logout-link"
                            onClick={() => {
                                localStorage.removeItem('jwt');
                                localStorage.removeItem("utilisateur");
                            }}
                            to="/"
                        >
                            <button className="logout-btn">Déconnexion</button>
                        </Link>
                    </div>
                    : ""}

                <div className="form-content">
                    <div className="id-display">
                        <label className="id-label">ID: {idVal}</label>
                    </div>

                    <div className="form-inputs">
                        <div className="input-group">
                            <label className="input-label">Titre</label>
                            <input
                                className="input-field title-input"
                                placeholder="Entrez le titre de votre tâche"
                                value={titre}
                                onChange={(e) => Valuechange(e)}
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Description</label>
                            <textarea
                                className="textarea-field description-input"
                                placeholder="Décrivez votre tâche en détail..."
                                value={valueInputDescription}
                                onChange={(e) => valueChangeDescription(e)}
                                rows="4"
                            />
                        </div>

                        <div className="button-group">
                            <button className="btn btn-update" onClick={modifier}>
                                Modifier
                            </button>
                            <button className="btn btn-create" onClick={fetchCreer}>
                                Créer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section des filtres */}
                <div className="filters-section">
                    <div className="filters-header">
                        <h3 className="filters-title">
                            <span className="filter-icon">🔍</span>
                            Filtres & Recherche
                        </h3>
                        <button
                            className="reset-filters-btn"
                            onClick={resetFilters}
                            title="Réinitialiser tous les filtres"
                        >
                            ↻ Reset
                        </button>
                    </div>

                    <div className="filters-grid">
                        {/* Barre de recherche */}
                        <div className="filter-group search-group">
                            <label className="filter-label">Rechercher</label>
                            <div className="search-input-wrapper">
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Rechercher dans les titres et descriptions..."
                                    value={filters.searchTerm}
                                    onChange={(e) => updateFilter('searchTerm', e.target.value)}
                                />
                                <span className="search-icon">🔍</span>
                            </div>
                        </div>

                        {/* Tri */}
                        <div className="filter-group">
                            <label className="filter-label">Trier par</label>
                            <select
                                className="filter-select"
                                value={filters.sortBy}
                                onChange={(e) => updateFilter('sortBy', e.target.value)}
                            >
                                <option value="date">Date de création</option>
                                <option value="title">Titre (A-Z)</option>
                                <option value="description">Description (A-Z)</option>
                            </select>
                        </div>

                        {/* Ordre de tri */}
                        <div className="filter-group">
                            <label className="filter-label">Ordre</label>
                            <select
                                className="filter-select"
                                value={filters.sortOrder}
                                onChange={(e) => updateFilter('sortOrder', e.target.value)}
                            >
                                <option value="desc">Décroissant</option>
                                <option value="asc">Croissant</option>
                            </select>
                        </div>

                        {/* Filtre par date */}
                        <div className="filter-group">
                            <label className="filter-label">Période</label>
                            <select
                                className="filter-select"
                                value={filters.dateFilter}
                                onChange={(e) => updateFilter('dateFilter', e.target.value)}
                            >
                                <option value="all">Toutes les dates</option>
                                <option value="today">Aujourd'hui</option>
                                <option value="week">Cette semaine</option>
                                <option value="month">Ce mois</option>
                            </select>
                        </div>
                    </div>

                    {/* Statistiques */}
                    <div className="stats-section">
                        <div className="stats-item">
                            <span className="stats-number">{listItem.length}</span>
                            <span className="stats-label">Tâches affichées</span>
                        </div>
                        <div className="stats-item">
                            <span className="stats-number">{allItems.length}</span>
                            <span className="stats-label">Total</span>
                        </div>
                        {filters.searchTerm && (
                            <div className="stats-item search-stats">
                                <span className="stats-label">
                                    Résultats pour "{filters.searchTerm}"
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {!load ? (
                    <div className="items-container">
                        {listItem.map((item, index) => {
                            return (
                                <div key={index} className="item-wrapper">
                                    <Item
                                        del={del}
                                        changeColor={changeColor}
                                        changeDec={textebisDesc}
                                        changetext={textebis}
                                        updatefunc={idchange}
                                        title={item.title}
                                        description={item.description}
                                        id={item.id}
                                    />
                                    <p className="item-date">{item?.createdAt}</p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="loading-container">
                        <h1 className="loading-text">Chargement...</h1>
                    </div>
                )}
            </div>
        </div>
    );
}