import React, { useCallback, useEffect, useState } from "react";
import lien from "./lien";
import ItemCategorie from "./ItemCategorie";
import { useNotify } from "./Notification";
import "./css/categorie.css";

export function Categorie() {
    const [categorieDescription, setCategorieDescription] = useState("");
    const [idVal, setId] = useState(-1);
    const [categorie, setCategorie] = useState("");
    const [categorieCard, setCategorieCard] = useState([]);
    const [colorCategorie, setColorCategorie] = useState("#000000");
    const [month, setMonth] = useState("");
    const [annee, setAnnee] = useState("");
    const [budgetDebutMois, setBudgetDebutMois] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const notify = useNotify();

    useEffect(() => {
        fetchAPI();
    }, []);

    const fetchAPI = useCallback(async () => {
        const jwt = localStorage.getItem("jwt") || "";
        const userId = parseInt(localStorage.getItem("utilisateur") || "0", 10);
        const response = await fetch(`${lien.url}categorie/byuser/${userId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        const data = await response.json();
        setCategorieCard(data);
    }, []);

    const fetchDelete = useCallback(async (id) => {
        const jwt = localStorage.getItem("jwt") || "";
        await fetch(`${lien.url}categorie/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jwt }),
        });
        await fetchAPI();
        notify("Catégorie supprimée si elle n'est pas rattachée à d'autres éléments", "info");
    }, [fetchAPI, notify]);

    const fetchCreate = useCallback(async (e) => {
        e.preventDefault();
        const jwt = localStorage.getItem("jwt") || "";
        await fetch(`${lien.url}categorie`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                categorie,
                description: categorieDescription,
                color: colorCategorie,
                user: parseInt(localStorage.getItem("utilisateur") || "0", 10),
                month,
                annee,
                budgetDebutMois,
                jwt,
            }),
        });
        await fetchAPI();
        notify("Catégorie créée", "success");
    }, [categorie, categorieDescription, colorCategorie, month, annee, budgetDebutMois, fetchAPI, notify]);

    const fetchUpdate = useCallback(async () => {
        const jwt = localStorage.getItem("jwt") || "";
        await fetch(`${lien.url}categorie/${idVal}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                categorie,
                description: categorieDescription,
                color: colorCategorie,
                user: parseInt(localStorage.getItem("utilisateur") || "0", 10),
                month,
                annee,
                budgetDebutMois,
                jwt,
            }),
        });
        notify("Catégorie mise à jour", "success");
        await fetchAPI();
    }, [idVal, categorie, categorieDescription, colorCategorie, month, annee, budgetDebutMois, fetchAPI, notify]);

    const filteredCategories = categorieCard.filter((item) =>
        item.categorie.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="categorie-wrapper">
            <form className="categorie-form" onSubmit={fetchCreate}>
                <input type="color" value={colorCategorie} onChange={(e) => setColorCategorie(e.target.value)} />
                <input type="text" placeholder="Catégorie" value={categorie} onChange={(e) => setCategorie(e.target.value)} />
                <input type="number" placeholder="Année" value={annee} onChange={(e) => setAnnee(e.target.value)} />
                <select value={month} onChange={(e) => setMonth(e.target.value)}>
                    <option value="">Mois</option>
                    {["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"].map((mois) => (
                        <option key={mois} value={mois}>{mois}</option>
                    ))}
                </select>
                <input type="number" placeholder="Budget" value={budgetDebutMois} onChange={(e) => setBudgetDebutMois(e.target.value)} />
                <input type="text" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <div className="form-buttons">
                    <button type="button" onClick={fetchUpdate}>Modifier</button>
                    <button type="submit">Créer</button>
                </div>
            </form>
            <div className="categorie-list">
                {filteredCategories.map((item) => (
                    <div key={item.id} className="categorie-card" style={{ backgroundColor: item.color }}>
                        <ItemCategorie
                            del={() => fetchDelete(item.id)}
                            color={item.color}
                            changeColor={setColorCategorie}
                            changecategorie={setCategorie}
                            changeDec={setCategorie}
                            changeTitle={setCategorieDescription}
                            idFunc={setId}
                            changeMonth={setMonth}
                            changeBudgetDebutMois={setBudgetDebutMois}
                            changeAnnee={setAnnee}
                            categorie={item.categorie}
                            annee={item.annee}
                            month={item.month}
                            budgetDebutMois={item.budgetDebutMois}
                            id={item.id}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}