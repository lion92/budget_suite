import React, { useCallback, useEffect, useState } from "react";
import lien from "./lien";
import ItemCategorie from "./ItemCategorie";
import { useNotify } from "./Notification";

export function Categorie(props) {
    let [categorieDescription, setCategorieDescription] = useState("");
    let [idCategorieValue, setidCategorieValue] = useState(-1);
    let [categorie, setCategorie] = useState("");
    let [valueInput, setValue] = useState("");
    let [valueInputDescription, setDescription] = useState("");
    let [idVal, setId] = useState(-1);
    let [categorieCard, setCategorieCard] = useState([]);
    let [colorCategorie, setColorCategorie] = useState("black");
    let [month, setMonth] = useState("");
    let [annee, setAnnee] = useState("");
    let [budgetDebutMois, setbudgetDebutMois] = useState(0);
    const notify = useNotify();
    const [load, setLoad] = useState(false);

    // États pour le filtre
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    let attendre = () => {
        setLoad(true);
        setTimeout(() => {
            setLoad(false);
        }, 2000);
    };

    useEffect(() => {
        attendre();
        fetchAPI();
    }, []);

    // Fonction de filtrage dynamique
    const filteredCategories = categorieCard.filter((item) => {
        return (
            item.categorie.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedMonth ? item.month === selectedMonth : true) &&
            (selectedYear ? item.annee.toString() === selectedYear.toString() : true)
        );
    });

    let idchange = (data) => setId(data);
    let changeAnnee = (data) => setAnnee(data);
    let changeMonth = (data) => setMonth(data);
    let changeBudgetDebutMois = (data) => setbudgetDebutMois(data);
    let changecategorie = (data) => setCategorie(data);
    let changeColor = (data) => setColorCategorie(data);

    let fetchAPI = useCallback(async () => {
        let str = localStorage.getItem("jwt") || "";
        let idUser = parseInt(localStorage.getItem("utilisateur") || "0", 10);
        const response = await fetch(`${lien.url}categorie/byuser/${idUser}`, {
            headers: { Authorization: `Bearer ${str}` },
        });
        const resbis = await response.json();
        setCategorieCard(resbis);
    }, []);

    let fetchdelete = useCallback(async (data) => {
        let str = localStorage.getItem("jwt") || "";
        let idTodo = parseInt(data, 10);
        await fetch(`${lien.url}categorie/${idTodo}`, {
            method: "DELETE",
            body: JSON.stringify({ jwt: str }),
            headers: { "Content-Type": "application/json" },
        });
        await fetchAPI();
        notify("Catégorie supprimée si elle n'est pas rattachée à d'autres éléments", "info");
    });

    let fetchCreer = useCallback(async (e) => {
        e.preventDefault();
        let str = localStorage.getItem("jwt") || "";
        await fetch(`${lien.url}categorie`, {
            method: "POST",
            body: JSON.stringify({
                categorie,
                description: categorieDescription,
                color: colorCategorie,
                user: parseInt(localStorage.getItem("utilisateur") || "0", 10),
                month,
                annee,
                budgetDebutMois,
                jwt: str,
            }),
            headers: { "Content-Type": "application/json" },
        });
        await fetchAPI();
        notify("Catégorie créée", "success");
    });

    let fetchAPIupdate = useCallback(async () => {
        let str = localStorage.getItem("jwt") || "";
        await fetch(`${lien.url}categorie/${idVal}`, {
            method: "PUT",
            body: JSON.stringify({
                categorie,
                description: categorieDescription,
                color: colorCategorie,
                user: parseInt(localStorage.getItem("utilisateur") || "0", 10),
                month,
                annee,
                budgetDebutMois,
                jwt: str,
            }),
            headers: { "Content-Type": "application/json" },
        });
        notify("Catégorie mise à jour", "success");
        await fetchAPI();
    });

    return (
        <div className="container2">
            <div>
                <div className="containerButton">
                    <div>
                        <input
                            type="color"
                            value={colorCategorie}
                            style={{width:"100px"}}
                            onChange={(e) => setColorCategorie(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Catégorie</label>
                        <input placeholder="Catégorie" value={categorie} onChange={(e) => setCategorie(e.target.value)} />
                    </div>

                    <div>
                        <label>Mois</label>
                        <select value={month} onChange={(e) => setMonth(e.target.value)} className="form-select">
                            <option value="">Tous</option>
                            {["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"].map((mois) => (
                                <option key={mois} value={mois}>{mois}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Année</label>
                        <input type="number" placeholder="Année" value={annee} onChange={(e) => setAnnee(e.target.value)} />
                    </div>

                    <div>
                        <label>Budget Début Mois</label>
                        <input placeholder="Budget" value={budgetDebutMois} onChange={(e) => setbudgetDebutMois(e.target.value)} />
                    </div>

                    {/* Champs de filtre */}
                    <div>
                        <label>Filtrer par Nom</label>
                        <input type="text" placeholder="Rechercher une catégorie..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>

                    <div>
                        <button onClick={fetchAPIupdate}>Modifier</button>
                        <button onClick={fetchCreer}>Créer</button>
                    </div>
                </div>

                <div className="containerCote">
                    {filteredCategories.map((item, index) => (
                        <div key={index} className="container" style={{ backgroundColor: item.color, margin: "5px" }}>
                            <ItemCategorie
                                del={(e) => fetchdelete(item.id)}
                                color={item.color}
                                changeColor={changeColor}
                                changecategorie={changecategorie}
                                changeDec={setCategorie}
                                changeTitle={setCategorieDescription}
                                idFunc={idchange}
                                changeMonth={changeMonth}
                                changeBudgetDebutMois={changeBudgetDebutMois}
                                changeAnnee={changeAnnee}
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
        </div>
    );
}
