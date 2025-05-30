import React, { useEffect, useState } from 'react';
import AjoutBudget from "./ajoutBudget";
import lien from "./lien";

const AllSpendFilters = () => {
    const [year, setYear] = useState("2023");
    const [listDesDepense, setListDesDepense] = useState([]);
    const [filteredDepense, setFilteredDepense] = useState([]);
    const [minMontant, setMinMontant] = useState('');
    const [maxMontant, setMaxMontant] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [descriptionSearch, setDescriptionSearch] = useState('');
    const [categorieSearch, setCategorieSearch] = useState('');
    const [totalFilteredMontant, setTotalFilteredMontant] = useState(0);

    useEffect(() => {
        const fetchAPI = async () => {
            const idUser = parseInt(localStorage.getItem("utilisateur"));
            if (isNaN(idUser)) {
                console.error("Invalid user ID from localStorage");
                return;
            }
            try {
                const response = await fetch(`${lien.url}action/byuser/${idUser}`);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const resbis = await response.json();
                console.log(resbis)
                setListDesDepense(resbis);
                setFilteredDepense(resbis); // Initialize filtered list with all expenses
            } catch (error) {
                console.error("Failed to fetch expenses:", error);
            }
        };

        fetchAPI();
    }, []);

    useEffect(() => {
        const filterExpenses = () => {
            let filtered = listDesDepense;

            // Filtrer par montant
            if (minMontant !== '') {
                filtered = filtered.filter(expense => expense.montant >= parseFloat(minMontant));
            }
            if (maxMontant !== '') {
                filtered = filtered.filter(expense => expense.montant <= parseFloat(maxMontant));
            }

            // Filtrer par date
            if (startDate !== '') {
                filtered = filtered.filter(expense => new Date(expense.dateTransaction) >= new Date(startDate));
            }
            if (endDate !== '') {
                filtered = filtered.filter(expense => new Date(expense.dateTransaction) <= new Date(endDate));
            }

            // Filtrer par description
            if (descriptionSearch !== '') {
                filtered = filtered.filter(expense =>
                    expense.description.toLowerCase().includes(descriptionSearch.toLowerCase())
                );
            }

            // Filtrer par catégorie
            if (categorieSearch !== '') {
                filtered = filtered.filter(expense =>
                    expense.categorie.toLowerCase().includes(categorieSearch.toLowerCase())
                );
            }

            setFilteredDepense(filtered);

            // Calculer la somme des montants filtrés
            const total = filtered.reduce((acc, expense) => acc + expense.montant, 0);
            setTotalFilteredMontant(total);
        };

        filterExpenses();
    }, [minMontant, maxMontant, startDate, endDate, descriptionSearch, categorieSearch, listDesDepense]);

    const resetFilters = () => {
        setMinMontant('');
        setMaxMontant('');
        setStartDate('');
        setEndDate('');
        setDescriptionSearch('');
        setCategorieSearch('');
        setFilteredDepense(listDesDepense); // Reset to show all expenses
        setTotalFilteredMontant(listDesDepense.reduce((acc, expense) => acc + expense.montant, 0)); // Reset total amount
    };

    return (
        <>
            <h1 style={{ fontSize: 20, color: "blueviolet", textAlign: "center" }}>Toutes vos dépenses</h1>
            <div className="container" style={{ marginBottom: '20px', textAlign: 'center' }}>
                <input
                    type="number"
                    placeholder="Montant minimal"
                    value={minMontant}
                    onChange={(e) => setMinMontant(e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="number"
                    placeholder="Montant maximal"
                    value={maxMontant}
                    onChange={(e) => setMaxMontant(e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                <input
                    type="date"
                    placeholder="Date de début"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ marginRight: '10px', color:"black" }}
                />
                <input
                    type="date"
                    placeholder="Date de fin"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ marginRight: '10px', color:"black" }}
                />
                <input
                    type="text"
                    placeholder="Recherche description"
                    value={descriptionSearch}
                    onChange={(e) => setDescriptionSearch(e.target.value)}
                    style={{ marginRight: '10px', color:"black" }}
                />
                <input
                    type="text"
                    placeholder="Recherche catégorie"
                    value={categorieSearch}
                    onChange={(e) => setCategorieSearch(e.target.value)}
                    style={{ marginRight: '10px' }}
                />
                <button onClick={resetFilters} style={{ padding: '5px 10px', marginLeft: '10px' }}>
                    Réinitialiser
                </button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '20px', color: "red", fontSize:30 }}>
                <strong style={{ textAlign: 'center', marginBottom: '20px', color: "black" }}>Total des montants après filtre: </strong>{totalFilteredMontant} €
            </div>
            <div className="container">
                {filteredDepense.map((item) => (
                    <div key={item.id} className="card" style={{height: "100%", boxShadow: "4px 4px 4px black"}}>
                        <div>Id: {item.id}</div>
                        <div style={{color: "red"}}>Montant: {item.montant}</div>
                        <div className="description">Description: {item.description}</div>
                        <div className="description">Categorie: {item.categorie}</div>
                        <div className="description">Date: {item.dateTransaction}</div>
                        <div style={{fontSize: 32, marginBottom: 10, color: 'black'}}>
                            <i className={item?.iconName}></i>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default AllSpendFilters;
