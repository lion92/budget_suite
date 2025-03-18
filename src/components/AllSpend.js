import React, { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx"; // Importation de la bibliothèque SheetJS
import lien from "./lien";
import AjoutBudget from "./ajoutBudget";

const AllSpend = () => {
    const [listDesDepense, setListDesDepense] = useState([]);
    const [monthlySummary, setMonthlySummary] = useState({});
    const [categoryColors, setCategoryColors] = useState({});
    const [budget, setBudget] = useState(0);
    const [budgetUsed, setBudgetUsed] = useState(0);
    const [budgetRemaining, setBudgetRemaining] = useState(0);
    const pdfRef = useRef();

    useEffect(() => {
        const fetchAPI = async () => {
            const idUser = parseInt(localStorage.getItem("utilisateur"));
            if (isNaN(idUser)) return;

            try {
                const response = await fetch(`${lien.url}action/byuser/${idUser}`);
                const data = await response.json();
                if (data.length === 0) return;

                setListDesDepense(data);
                generateMonthlySummary(data);
                calculateBudgetAnalysis(data);
                assignCategoryColors(data);
            } catch (error) {
                console.error("Erreur lors du chargement des dépenses :", error);
            }
        };

        fetchAPI();
    }, []);

    const assignCategoryColors = (expenses) => {
        const colors = [
            "#6FA3EF", "#7EDABF", "#F9D56E", "#F7A1C4", "#A38DE3", "#F8A978"
        ];
        const categoryMap = {};
        let index = 0;

        [...new Set(expenses.map(exp => exp.categorie))].forEach(category => {
            categoryMap[category] = colors[index % colors.length];
            index++;
        });

        setCategoryColors(categoryMap);
    };

    const generateMonthlySummary = (expenses) => {
        const summary = {};
        expenses.forEach(({ montant, dateTransaction, categorie }) => {
            const date = new Date(dateTransaction);
            const month = date.toLocaleString("fr-FR", { month: "long", year: "numeric" });

            if (!summary[month]) {
                summary[month] = { total: 0, categories: {} };
            }
            summary[month].total += montant;
            summary[month].categories[categorie] = (summary[month].categories[categorie] || 0) + montant;
        });
        setMonthlySummary(summary);
    };

    const calculateBudgetAnalysis = (expenses) => {
        const totalExpenses = expenses.reduce((acc, { montant }) => acc + montant, 0);
        setBudgetUsed(totalExpenses);
        setBudgetRemaining(budget - totalExpenses);
    };

    const exportToPDF = async () => {
        const pdf = new jsPDF("p", "mm", "a4");
        let yOffset = 20;

        // En-tête du document
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.text("Bilan Mensuel des Dépenses", 105, yOffset, { align: "center" });
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Date: ${new Date().toLocaleDateString("fr-FR")}`, 10, yOffset + 10);
        yOffset += 20;

        Object.entries(monthlySummary).forEach(([month, { total, categories }]) => {
            if (yOffset > 260) {
                pdf.addPage();
                yOffset = 20;
            }

            pdf.setFontSize(14);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(33, 150, 243);
            pdf.text(month, 10, yOffset);
            yOffset += 8;

            pdf.setFontSize(12);
            pdf.setTextColor(0);
            pdf.text(`Dépense Totale: ${total.toFixed(2)} €`, 10, yOffset);
            yOffset += 8;

            const tableData = Object.entries(categories).map(([category, amount]) => [
                category,
                `${amount.toFixed(2)} €`,
            ]);

            pdf.autoTable({
                startY: yOffset,
                head: [["Catégorie", "Montant"]],
                body: tableData,
                theme: "grid",
                styles: { fontSize: 10 },
                headStyles: { fillColor: [33, 150, 243] },
                didParseCell: function (data) {
                    if (data.section === "body" && data.column.index === 0) {
                        const category = data.cell.raw;
                        if (categoryColors[category]) {
                            data.cell.styles.fillColor = categoryColors[category];
                        }
                    }
                },
                margin: { top: 10 },
            });

            yOffset = pdf.autoTable.previous.finalY + 10;
        });

        const chartCanvas = await html2canvas(pdfRef.current);
        const chartImage = chartCanvas.toDataURL("image/png");
        pdf.addImage(chartImage, "PNG", 10, yOffset, 180, 100);

        pdf.save("Bilan_Mensuel.pdf");
    };

    // Nouvelle fonction pour exporter en Excel
    const exportToExcel = () => {
        // Création d'un workbook vide
        const wb = XLSX.utils.book_new();
        wb.SheetNames = [];
        wb.Sheets = {};

        // Création d'une feuille de résumé mensuel
        const summaryData = [
            ["Bilan Mensuel des Dépenses"],
            ["Date d'export", new Date().toLocaleDateString("fr-FR")],
            [""],
        ];

        // Ajout des données mensuelles
        Object.entries(monthlySummary).forEach(([month, { total, categories }]) => {
            summaryData.push([""]); // Ligne vide pour séparation
            summaryData.push([month]);
            summaryData.push(["Dépense Totale", `${total.toFixed(2)} €`]);
            summaryData.push([""]); // Ligne vide avant les catégories
            summaryData.push(["Catégorie", "Montant"]);

            // Ajouter les catégories pour ce mois
            Object.entries(categories).forEach(([category, amount]) => {
                summaryData.push([category, `${amount.toFixed(2)} €`]);
            });
        });

        // Création de la feuille de calcul pour le résumé
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

        // Ajout de la feuille au workbook
        XLSX.utils.book_append_sheet(wb, summarySheet, "Résumé Mensuel");

        // Création d'une feuille pour les données détaillées si nécessaire
        if (listDesDepense.length > 0) {
            // Conversion des dépenses en format plat pour Excel
            const detailedData = listDesDepense.map(item => ({
                Date: new Date(item.dateTransaction).toLocaleDateString("fr-FR"),
                Description: item.description || "",
                Catégorie: item.categorie,
                Montant: `${item.montant.toFixed(2)} €`
            }));

            // Création de la feuille à partir des données
            const detailSheet = XLSX.utils.json_to_sheet(detailedData);

            // Ajout de la feuille au workbook
            XLSX.utils.book_append_sheet(wb, detailSheet, "Détails des Dépenses");
        }

        // Exportation du fichier Excel
        XLSX.writeFile(wb, "Bilan_Mensuel_Dépenses.xlsx");
    };

    const chartData = {
        labels: Object.keys(monthlySummary),
        datasets: [
            {
                label: "Dépenses par Mois",
                data: Object.values(monthlySummary).map((m) => m.total),
                backgroundColor: "blue",
                borderWidth: 1,
            },
        ],
    };

    return (
        <>
            <h1 style={{ fontSize: 20, color: "blueviolet", textAlign: "center" }}>Toutes vos dépenses</h1>
            <AjoutBudget />
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-start", margin: "10px" }}>
                <button
                    onClick={exportToPDF}
                    style={{
                        padding: "10px",
                        backgroundColor: "blueviolet",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        borderRadius: "5px",
                    }}
                >
                    📄 Exporter en PDF
                </button>
                <button
                    onClick={exportToExcel}
                    style={{
                        padding: "10px",
                        backgroundColor: "green",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        borderRadius: "5px",
                    }}
                >
                    📊 Exporter en Excel
                </button>
            </div>
            <div ref={pdfRef} style={{ padding: "10px" }}>
                <h2 style={{ color: "black" }}>Bilan Mensuel</h2>
                <div className="container">
                    {Object.entries(monthlySummary).map(([month, { total, categories }]) => (
                        <div key={month} style={{ marginBottom: "20px", padding: "10px", border: "1px solid black" }}>
                            <h3 style={{ color: "black" }}>{month} - Dépense Totale: {total}€</h3>
                            <ul>
                                {Object.entries(categories).map(([category, amount]) => (
                                    <li key={category} style={{ color: categoryColors[category] }}>
                                        {category}: {amount}€
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div style={{ width: "80%", margin: "auto" }}>
                    <h2>Graphique des Dépenses</h2>
                    <Bar data={chartData} />
                </div>
            </div>
        </>
    );
};

export default AllSpend;