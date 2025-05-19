import React, { useEffect, useState } from 'react';
import { useEnvelopeStore } from "../useEnvelopeStore";
import useBudgetStore from "../useBudgetStore";
import '../components/css/enveloppe_manager.css';
import { toast } from 'react-toastify';

const EnvelopeManager = ({
                             notify = (msg, type) => {
                                 if (type === 'success') toast.success(msg);
                                 else toast.error(msg);
                             },
                         }) => {
    const {
        envelopes,
        fetchEnvelopes,
        createEnvelope,
        updateEnvelope,
        deleteEnvelope,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        selectedMonth,
        selectedYear,
        setMonth,
        setYear,
    } = useEnvelopeStore();

    const { revenus, fetchRevenus } = useBudgetStore();

    const [newEnvelopeName, setNewEnvelopeName] = useState('');
    const [newEnvelopeAmount, setNewEnvelopeAmount] = useState('');
    const [editingEnvelope, setEditingEnvelope] = useState(null);
    const [editedEnvelopeName, setEditedEnvelopeName] = useState('');
    const [editedEnvelopeAmount, setEditedEnvelopeAmount] = useState('');
    const [newTransactions, setNewTransactions] = useState({});
    const [editingTransaction, setEditingTransaction] = useState({});

    useEffect(() => {
        fetchEnvelopes();
        fetchRevenus();
    }, [selectedMonth, selectedYear]);

    const totalRevenus = revenus.reduce((acc, r) => {
        const date = new Date(r.date);
        return (date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear)
            ? acc + parseFloat(r.amount || 0)
            : acc;
    }, 0);

    const totalByEnvelope = (env) =>
        env.transactions?.reduce((acc, t) => acc + parseFloat(t.amount), 0) || 0;

    const totalInEnvelopes = envelopes.reduce((sum, env) => sum + totalByEnvelope(env), 0);
    const totalMontantEnveloppes = envelopes.reduce((sum, env) => sum + parseFloat(env.amount || 0), 0);
    const resteRepartir = totalRevenus - totalMontantEnveloppes;

    const handleCreateEnvelope = () => {
        if (!newEnvelopeName.trim() || isNaN(parseFloat(newEnvelopeAmount))) return;
        createEnvelope(newEnvelopeName, parseFloat(newEnvelopeAmount), notify);
        setNewEnvelopeName('');
        setNewEnvelopeAmount('');
    };

    const handleUpdateEnvelope = (id) => {
        if (!editedEnvelopeName.trim() || isNaN(parseFloat(editedEnvelopeAmount))) return;

        updateEnvelope(id, editedEnvelopeName, parseFloat(editedEnvelopeAmount), notify);
        setEditingEnvelope(null);
    };

    const handleDeleteEnvelope = (id) => {
        if (window.confirm('Supprimer cette enveloppe ?')) {
            deleteEnvelope(id, notify);
        }
    };

    const handleAddTransaction = (envelope) => {
        const envelopeId = envelope.id;
        const { description, amount } = newTransactions[envelopeId] || {};
        if (!description || isNaN(parseFloat(amount))) return;

        const reste = parseFloat(envelope.amount) - totalByEnvelope(envelope);
        if (parseFloat(amount) > reste) {
            notify("Montant dépasse le budget de l’enveloppe", "error");
            return;
        }

        addTransaction(
            envelopeId,
            {
                description,
                amount: parseFloat(amount),
                date: new Date(),
            },
            notify
        );

        setNewTransactions((prev) => ({
            ...prev,
            [envelopeId]: { description: '', amount: '' },
        }));
    };

    const handleUpdateTransaction = (transaction) => {
        const edit = editingTransaction[transaction.id];
        if (!edit || !edit.description || isNaN(parseFloat(edit.amount))) return;

        updateTransaction(
            transaction.id,
            {
                description: edit.description,
                amount: parseFloat(edit.amount),
                date: new Date(transaction.date),
            },
            notify
        );

        setEditingTransaction((prev) => {
            const updated = { ...prev };
            delete updated[transaction.id];
            return updated;
        });
    };

    const handleDeleteTransaction = (transactionId) => {
        if (window.confirm('Supprimer cette transaction ?')) {
            deleteTransaction(transactionId, notify);
        }
    };

    return (
        <div style={{ margin: 'auto', maxWidth: '800px' }}>
            <h2>Mes enveloppes ({selectedMonth}/{selectedYear})</h2>

            <div style={{ marginBottom: '1rem' }}>
                <p><strong>Total revenus :</strong> {totalRevenus.toFixed(2)} €</p>
                <p><strong>Total alloué dans enveloppes :</strong> {totalMontantEnveloppes.toFixed(2)} €</p>
                <p><strong>Total utilisé dans enveloppes :</strong> {totalInEnvelopes.toFixed(2)} €</p>
                <p><strong>Reste à répartir :</strong> {resteRepartir.toFixed(2)} €</p>
                {totalMontantEnveloppes > totalRevenus && (
                    <p style={{ color: 'red' }}>⚠️ Le total des enveloppes dépasse vos revenus</p>
                )}
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label>Mois : </label>
                <select style={{ color: "black", width: '50%' }} value={selectedMonth}
                        onChange={(e) => setMonth(parseInt(e.target.value))}>
                    {[...Array(12).keys()].map((m) => (
                        <option key={m + 1} value={m + 1}>{m + 1}</option>
                    ))}
                </select>

                <label style={{ marginLeft: '1rem' }}>Année : </label>
                <input
                    type="number"
                    value={selectedYear}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    style={{ width: '100px', color: "black" }}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <input
                    style={{ width: '40%' }}
                    type="text"
                    placeholder="Nom de l'enveloppe"
                    value={newEnvelopeName}
                    onChange={(e) => setNewEnvelopeName(e.target.value)}
                />
                <input
                    style={{ width: '30%', marginLeft: '1rem' }}
                    type="number"
                    placeholder="Montant"
                    value={newEnvelopeAmount}
                    onChange={(e) => setNewEnvelopeAmount(e.target.value)}
                />
                <button onClick={handleCreateEnvelope}>➕ Ajouter</button>
            </div>

            {envelopes.map((env) => (
                <div key={env.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
                    {editingEnvelope === env.id ? (
                        <>
                            <input
                                style={{ width: '40%' }}
                                type="text"
                                placeholder="Nom"
                                value={editedEnvelopeName}
                                onChange={(e) => setEditedEnvelopeName(e.target.value)}
                            />
                            <input
                                style={{ width: '30%', marginLeft: '1rem' }}
                                type="number"
                                placeholder="Montant"
                                value={editedEnvelopeAmount}
                                onChange={(e) => setEditedEnvelopeAmount(e.target.value)}
                            />
                            <button onClick={() => handleUpdateEnvelope(env.id)}>💾</button>
                            <button onClick={() => setEditingEnvelope(null)}>❌</button>
                        </>
                    ) : (
                        <>
                            <h3>{env.name}</h3>
                            <p><strong>Montant prévu :</strong> {parseFloat(env.amount).toFixed(2)} €</p>
                            <p><strong>Dépensé :</strong> {totalByEnvelope(env).toFixed(2)} €</p>
                            <p><strong>Reste :</strong> {(parseFloat(env.amount) - totalByEnvelope(env)).toFixed(2)} €</p>
                            <button onClick={() => {
                                setEditingEnvelope(env.id);
                                setEditedEnvelopeName(env.name);
                                setEditedEnvelopeAmount(env.amount);
                            }}>✏️</button>
                            <button onClick={() => handleDeleteEnvelope(env.id)}>🗑️</button>
                        </>
                    )}

                    <h4>Transactions :</h4>
                    <ul>
                        {env.transactions?.map((t) => (
                            <li key={t.id}>
                                {editingTransaction[t.id] ? (
                                    <>
                                        <input
                                            value={editingTransaction[t.id].description}
                                            onChange={(e) =>
                                                setEditingTransaction((prev) => ({
                                                    ...prev,
                                                    [t.id]: { ...prev[t.id], description: e.target.value },
                                                }))
                                            }
                                        />
                                        <input
                                            type="number"
                                            value={editingTransaction[t.id].amount}
                                            onChange={(e) =>
                                                setEditingTransaction((prev) => ({
                                                    ...prev,
                                                    [t.id]: { ...prev[t.id], amount: e.target.value },
                                                }))
                                            }
                                        />
                                        <button onClick={() => handleUpdateTransaction(t)}>💾</button>
                                        <button onClick={() =>
                                            setEditingTransaction((prev) => {
                                                const updated = { ...prev };
                                                delete updated[t.id];
                                                return updated;
                                            })}>❌</button>
                                    </>
                                ) : (
                                    <>
                                        {t.description} – {t.amount} € {new Date(t.date).toLocaleDateString('fr-FR')}
                                        <button onClick={() =>
                                            setEditingTransaction((prev) => ({
                                                ...prev,
                                                [t.id]: { description: t.description, amount: t.amount },
                                            }))
                                        }>✏️</button>
                                        <button onClick={() => handleDeleteTransaction(t.id)}>🗑️</button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>

                    <div>
                        <input
                            type="text"
                            placeholder="Description"
                            value={newTransactions[env.id]?.description || ''}
                            onChange={(e) =>
                                setNewTransactions((prev) => ({
                                    ...prev,
                                    [env.id]: { ...prev[env.id], description: e.target.value },
                                }))
                            }
                        />
                        <input
                            type="number"
                            placeholder="Montant"
                            value={newTransactions[env.id]?.amount || ''}
                            onChange={(e) =>
                                setNewTransactions((prev) => ({
                                    ...prev,
                                    [env.id]: { ...prev[env.id], amount: e.target.value },
                                }))
                            }
                        />
                        <button onClick={() => handleAddTransaction(env)}>➕ Ajouter transaction</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EnvelopeManager;
