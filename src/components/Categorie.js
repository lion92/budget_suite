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
    const [iconName, setIconName] = useState("");
    const notify = useNotify();

    useEffect(() => {
        fetchAPI();
    }, []);

    const fetchAPI = useCallback(async () => {
        const jwt = localStorage.getItem("jwt") || "";
        const userId = parseInt(localStorage.getItem("utilisateur") || "0", 10);

        // Fetch des catégories
        const resCategorie = await fetch(`${lien.url}categorie/byuser/${userId}`, {
            headers: { Authorization: `Bearer ${jwt}` },
        });
        const data = await resCategorie.json();

        // Fetch des icônes
        const resIcons = await fetch(`${lien.url}category-images`);
        const icons = await resIcons.json();

        // Associer chaque icône à sa catégorie
        const withIcons = data.map(cat => {
            const icon = icons.find(i => i.categorie?.id === cat.id);
            return { ...cat, iconName: icon?.iconName || "" };
        });

        setCategorieCard(withIcons);
    }, []);

    const fetchDelete = useCallback(async (id) => {
        const jwt = localStorage.getItem("jwt") || "";

        try {
            // Supprimer l'icône associée à la catégorie
            const iconRes = await fetch(`${lien.url}category-images/${id}`, {
                method: "DELETE",
            });

            if (!iconRes.ok) {
                console.warn(`Icône non supprimée (peut-être inexistante) pour la catégorie ${id}`);
            }

            // Supprimer la catégorie elle-même
            const res = await fetch(`${lien.url}categorie/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jwt }), // <- Ce body est inutile pour un DELETE si le JWT est dans les headers
            });

            if (!res.ok) {
                throw new Error(`Échec de suppression de la catégorie ${id}`);
            }

            await fetchAPI();
            notify("Catégorie et icône supprimées", "info");

        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            notify("Erreur lors de la suppression", "error");
        }
    }, [fetchAPI, notify]);

    const fetchCreate = useCallback(async (e) => {
        e.preventDefault();
        const jwt = localStorage.getItem("jwt") || "";
        const userId = parseInt(localStorage.getItem("utilisateur") || "0", 10);
        console.log(userId)

        try {
            // Création de la catégorie
            const res = await fetch(`${lien.url}categorie`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    categorie,
                    description: categorieDescription,
                    color: colorCategorie,
                    user: userId,
                    month,
                    annee,
                    budgetDebutMois,
                    jwt,
                }),
            });

            // Tenter de parser la réponse JSON
                console.log(res);
               let created = await res.json();

            // Création de l'icône si une catégorie est créée
            console.log(res);
            if (created?.id && iconName) {
                const iconRes = await fetch(`${lien.url}category-images`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        categoryId: created.id,
                        iconName,
                    }),
                });

                // Gérer une éventuelle erreur de réponse vide
                if (!iconRes.ok) {
                    console.warn("Échec lors de l’ajout de l’icône :", iconRes.status);
                }
            }

            await fetchAPI();
            notify("Catégorie créée avec succès", "success");

            // Reset des champs
            setCategorie("");
            setCategorieDescription("");
            setColorCategorie("#000000");
            setMonth("");
            setAnnee("");
            setBudgetDebutMois(0);
            setIconName("");

        } catch (error) {
            console.error("Erreur lors de la création :", error);
            notify("Échec de la création de la catégorie", "error");
        }
    }, [categorie, categorieDescription, colorCategorie, month, annee, budgetDebutMois, iconName, fetchAPI, notify]);


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

        if (idVal && iconName) {
            await fetch(`${lien.url}category-images`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    categoryId: idVal,
                    iconName,
                }),
            });
        }

        notify("Catégorie mise à jour", "success");
        await fetchAPI();
    }, [idVal, categorie, categorieDescription, colorCategorie, month, annee, budgetDebutMois, iconName, fetchAPI, notify]);

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
                <select value={iconName} onChange={(e) => setIconName(e.target.value)}>
                    <option value="">Icône</option>
                    <option value="fa-solid fa-utensils">🍽️ Nourriture</option>
                    <option value="fa-solid fa-car">🚗 Transport</option>
                    <option value="fa-solid fa-house">🏠 Logement</option>
                    <option value="fa-solid fa-heart">❤️ Santé</option>
                    <option value="fa-solid fa-cart-shopping">🛒 Courses</option>
                </select>
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
                            changeTitle={setCategorieDescription}
                            changeDec={setCategorieDescription}
                            idFunc={setId}
                            changeMonth={setMonth}
                            changeAnnee={setAnnee}
                            changeBudgetDebutMois={setBudgetDebutMois}
                            changeIcon={setIconName}
                            categorie={item.categorie}
                            annee={item.annee}
                            month={item.month}
                            budgetDebutMois={item.budgetDebutMois}
                            id={item.id}
                            iconName={item.iconName}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
