import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import lien from "./lien";
import AjoutBudget from "./ajoutBudget";
import ChartJS from "react-refresh";

ChartJS.register({
    id: 'dataLabels',
    afterDatasetsDraw(chart) {
        const ctx = chart.ctx;
        chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i);
            meta.data.forEach((bar, index) => {
                const value = dataset.data[index];
                ctx.fillStyle = 'black';
                ctx.fillText(value + '€', bar.x, bar.y - 5);
            });
        });
    }
});

const AllSpend = () => {
    const [listDesDepense, setListDesDepense] = useState([]);
    const [filteredDepense, setFilteredDepense] = useState([]);
    const [monthlySummary, setMonthlySummary] = useState({});
    const [budget, setBudget] = useState(0);
    const [budgetUsed, setBudgetUsed] = useState(0);
    const [budgetRemaining, setBudgetRemaining] = useState(0);
    const [monthlyBudget, setMonthlyBudget] = useState({});

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
                const data = await response.json();
                setListDesDepense(data);
                setFilteredDepense(data);
                generateMonthlySummary(data);
                calculateBudgetAnalysis(data);
            } catch (error) {
                console.error("Failed to fetch expenses:", error);
            }
        };

        fetchAPI();
    }, []);

    const generateMonthlySummary = (expenses) => {
        const summary = {};
        const budgetData = {};
        expenses.forEach(({ montant, dateTransaction, categorie }) => {
            const date = new Date(dateTransaction);
            const month = date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
            if (!summary[month]) {
                summary[month] = { total: 0, categories: {} };
                budgetData[month] = budget;
            }
            summary[month].total += montant;
            summary[month].categories[categorie] = (summary[month].categories[categorie] || 0) + montant;
        });
        setMonthlySummary(summary);
        setMonthlyBudget(budgetData);
    };

    const calculateBudgetAnalysis = (expenses) => {
        const totalExpenses = expenses.reduce((acc, { montant }) => acc + montant, 0);
        setBudgetUsed(totalExpenses);
        setBudgetRemaining(budget - totalExpenses);
    };

    const chartData = {
        labels: Object.keys(monthlySummary),
        datasets: [
            {
                label: "Dépenses par Mois",
                data: Object.values(monthlySummary).map(m => m.total),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderWidth: 1,
            },
            {
                label: "Budget Total par Mois",
                data: Object.values(monthlyBudget),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderWidth: 1,
            }
        ]
    };

    return (
        <>
            <h1 style={{ fontSize: 20, color: "blueviolet", textAlign: "center" }}>Toutes vos dépenses</h1>
            <AjoutBudget />
            <div className="container">
                <h2 style={{color:"black"}}>Bilan Mensuel</h2>
                {Object.entries(monthlySummary).map(([month, { total, categories }]) => (
                    <div key={month} style={{ marginBottom: "20px", padding: "10px", border: "1px solid black" }}>
                        <h3 style={{color:"black"}}>{month} - Dépense Totale: {total}€</h3>
                        <ul>
                            {Object.entries(categories).map(([category, amount]) => (
                                <li key={category}>{category}: {amount}€</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div style={{ width: '80%', margin: 'auto' }}>
                <h2>Graphique des Dépenses et Budgets</h2>
                <Bar data={chartData} options={{ plugins: { dataLabels: {} } }} />
            </div>
            <div className="container" style={{ textAlign: 'center', marginTop: '20px' }}>
                <h2>Analyse du Budget</h2>
                <p><strong>Budget total:</strong> {budget} €</p>
                <p><strong>Dépenses totales:</strong> {budgetUsed} €</p>
                <p><strong>Budget restant:</strong> {budgetRemaining} €</p>
            </div>
        </>
    );
};

export default AllSpend;
