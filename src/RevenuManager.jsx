import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import '../src/components/css/revenue.css'
import useBudgetStore from "./useBudgetStore";
import {useNotify} from "./Notification";

const RevenueManager = () => {
    const [description, setDescription] = useState("");
    const [montant, setMontant] = useState(0);
    const [date, setDate] = useState(new Date());

    const notify = useNotify();

    const {
        revenus,
        fetchRevenus,
        addRevenu,
        deleteRevenu
    } = useBudgetStore();

    useEffect(() => {
        fetchRevenus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addRevenu({
            name: description,
            amount: montant,
            date: date
        }, notify);


        setDescription("");
        setMontant(0);
        setDate(new Date());
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer ce revenu ?")) {
            await deleteRevenu(id, notify);
        }
    };

    return (
        <div className="revenue-manager">
            <h2>Mes Revenus</h2>

            <form onSubmit={handleSubmit} className="form-depense">
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Montant"
                    value={montant}
                    onChange={e => setMontant(parseFloat(e.target.value))}
                    required
                />
                <DatePicker
                    selected={date}
                    onChange={setDate}
                    dateFormat="dd/MM/yyyy"
                />
                <button type="submit">Ajouter Revenu</button>
            </form>

            <table>
                <thead>
                <tr>
                    <th>Description</th>
                    <th>Montant</th>
                    <th>Date</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {(revenus || []).map(rev => (
                    <tr key={rev.id}>
                        <td>{rev.name}</td>
                        <td>{rev.amount} €</td>
                        <td>{new Date(rev.date).toLocaleDateString("fr-FR")}</td>
                        <td>
                            <button className="btn-danger" onClick={() => handleDelete(rev.id)}>Supprimer</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default RevenueManager;
