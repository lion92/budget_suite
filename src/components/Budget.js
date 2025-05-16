import React, {useEffect, useRef, useState} from 'react';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import './css/budget_style.css';
import {useNotify} from "../Notification";
import AllSpend from "./AllSpend";
import useBudgetStore from "../useBudgetStore";
import ModalCategorie from "./ModalCategorie";


export function Budget() {
    const [description, setDescription] = useState("");
    const [montant, setMontant] = useState(0);
    const [categorie, setCategorie] = useState("");
    const [date, setDate] = useState(new Date());
    const [range, setRange] = useState([null, null]);
    const [startDate, endDate] = range;
    const [showModal, setShowModal] = useState(false);

    const notify = useNotify();
    const pdfref = useRef();

    const {
        depenses,
        total,
        categories,
        graphData,
        fetchDepenses,
        fetchCategories,
        fetchGraphData,
        addDepense,
        deleteDepense
    } = useBudgetStore();

    useEffect(() => {
        fetchDepenses();
        fetchCategories();
        fetchGraphData();
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

    const downloadPDF = () => {
        const input = pdfref.current;
        if (!input) return;
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("budget.pdf");
        });
    };

    const handleClick = () => {
        setShowModal(true);
    };

    const filtered = startDate && endDate
        ? (depenses || []).filter(d => {
            const dDate = new Date(d.dateTransaction);
            return dDate >= startDate && dDate <= endDate;
        })
        : (depenses || []);

    const totalFiltre = filtered.reduce((acc, val) => acc + parseFloat(val.montant || 0), 0);


    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="budget-container">
            <h1>Gestionnaire de Budget</h1>
            <div>
                <h1>Catégories</h1>
                <button onClick={handleClick}>Nouvelle catégorie</button>
                {showModal && <ModalCategorie onClose={handleCloseModal}/>}
            </div>
            <form onSubmit={handleCreate} className="form-depense">
                <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}/>
                <input type="number" placeholder="Montant" value={montant}
                       onChange={e => setMontant(parseFloat(e.target.value))}/>
                <select value={categorie} onChange={e => setCategorie(e.target.value)}>
                    <option value="">-- Choisir catégorie --</option>
                    {categories?.map(c => <option key={c.id} value={c.id}>{c.categorie}</option>)}
                </select>

                <DatePicker selected={date} onChange={setDate} dateFormat="dd/MM/yyyy"/>
                <button type="submit">Ajouter</button>
            </form>

            <div className="chart-section">
                <AllSpend depenses={filtered}/>
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
                {filtered.map(dep => (
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

            <p>Total : {totalFiltre.toFixed(2)} €</p>
        </div>
    );
}
