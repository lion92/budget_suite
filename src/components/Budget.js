import React, {useEffect, useRef, useState} from 'react';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import './css/budget_style.css';
import {useNotify} from "./Notification";
import AllSpend from "./AllSpend";
import useBudgetStore from "../useBudgetStore";
import ModalCategorie from "./ModalCategorie";
import RevenueManager from "./RevenuManager";
import MonthlyReportChart from "./MonthlyReportChart";


export function Budget() {
    const [description, setDescription] = useState("");
    const [montant, setMontant] = useState(0);
    const [categorie, setCategorie] = useState("");
    const [date, setDate] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [showModal, setShowModal] = useState(false);

    const notify = useNotify();
    const bilanRef = useRef();

    const {
        depenses,
        revenus,
        categories,
        fetchDepenses,
        fetchCategories,
        fetchRevenus,
        addDepense,
        deleteDepense
    } = useBudgetStore();

    useEffect(() => {
        fetchDepenses();
        fetchCategories();
        fetchRevenus();

    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        await addDepense({ montant, categorie, description, date }, notify);
        setDescription("");
        setMontant(0);
        setCategorie("");
        setDate(new Date());
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette dépense ?")) return;
        await deleteDepense(id, notify);
    };

    const handleClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Filtrage par mois/année sélectionnés
    const revenusFiltres = (revenus || []).filter(r => {
        const d = new Date(r.date);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });

    const depensesFiltres = (depenses || []).filter(d => {
        const dDate = new Date(d.dateTransaction);
        return dDate.getMonth() === selectedMonth && dDate.getFullYear() === selectedYear;
    });

    const totalRevenus = revenusFiltres.reduce((acc, val) => acc + parseFloat(val.amount || 0), 0);
    const totalDepenses = depensesFiltres.reduce((acc, val) => acc + parseFloat(val.montant || 0), 0);
    const solde = totalRevenus - totalDepenses;

    const downloadBilanPDF = () => {
        const input = bilanRef.current;
        if (!input) return;
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`bilan-budget-${selectedMonth + 1}-${selectedYear}.pdf`);
        });
    };

    return (
        <div className="budget-container">
            <h1>Gestionnaire de Budget</h1>


            <RevenueManager/>
            <div>
                <h1>Catégories</h1>
                <button onClick={handleClick}>Nouvelle catégorie</button>
                {showModal && <ModalCategorie onClose={handleCloseModal}/>}
            </div>
            <label>Dépenses</label>
            <form onSubmit={handleCreate} className="form-depense">
                <input placeholder="Description" value={description} aria-label="Description Dépense" onChange={e => setDescription(e.target.value)}/>
                <input type="number" placeholder="Montant" value={montant}  aria-label="Montant Dépense"
                       onChange={e => setMontant(parseFloat(e.target.value))}/>
                <select value={categorie} onChange={e => setCategorie(e.target.value)}>
                    <option value="">-- Choisir catégorie --</option>
                    {categories?.map(c => <option key={c.id} value={c.id}>{c.categorie}</option>)}
                </select>
                <DatePicker selected={date} onChange={setDate} dateFormat="dd/MM/yyyy"/>
                <button type="submit">Ajouter</button>
            </form>

            {/* Sélection du mois et de l’année */}
            <div className="select-date">
                <label>Mois :
                    <select value={selectedMonth} onChange={e => setSelectedMonth(parseInt(e.target.value))}>
                        {Array.from({length: 12}).map((_, i) => (
                            <option key={i} value={i}>{new Date(0, i).toLocaleString('fr-FR', {month: 'long'})}</option>
                        ))}
                    </select>
                </label>
                <label>Année :
                    <input type="number" value={selectedYear}
                           onChange={e => setSelectedYear(parseInt(e.target.value))}/>
                </label>
            </div>

            {/* Bilan mensuel */}
            <div className="bilan-mensuel" ref={bilanRef}>
                <h2>Bilan de {new Date(selectedYear, selectedMonth).toLocaleString('fr-FR', {
                    month: 'long',
                    year: 'numeric'
                })}</h2>
                <p><strong>Revenus :</strong> {totalRevenus.toFixed(2)} €</p>
                <p><strong>Dépenses :</strong> {totalDepenses.toFixed(2)} €</p>
                <p><strong>Solde :</strong> {solde.toFixed(2)} €</p>
                <button onClick={downloadBilanPDF}>Télécharger le bilan PDF</button>
            </div>

            {/* Graphique et tableau des dépenses */}
            <div className="chart-section">
                <AllSpend depenses={depensesFiltres}/>
            </div>

            <h2>Dépenses</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Montant</th>
                    <th>Description</th>
                    <th>Catégorie</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {depensesFiltres.map(dep => (
                    <tr key={dep.id}>
                        <td>{dep.id}</td>
                        <td>{dep.montant}</td>
                        <td>{dep.description}</td>
                        <td>{dep.categorie}</td>
                        <td>{new Date(dep.dateTransaction).toLocaleDateString('fr-FR')}</td>
                        <td>
                            <button className="btn-danger" onClick={() => handleDelete(dep.id)}>Supprimer</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <MonthlyReportChart/>
        </div>
    );
}
