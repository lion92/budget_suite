import React, {useEffect, useState} from 'react';
import {useEnvelopeStore} from "../useEnvelopeStore";
import {toast} from 'react-toastify';

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


    const [newEnvelopeName, setNewEnvelopeName] = useState('');
    const [editingEnvelope, setEditingEnvelope] = useState(null);
    const [editedEnvelopeName, setEditedEnvelopeName] = useState('');
    const [newTransactions, setNewTransactions] = useState({});
    const [editingTransaction, setEditingTransaction] = useState({});

    // ✅ Corrigé : fetchEnvelopes dans les dépendances
    useEffect(() => {
        fetchEnvelopes();
    }, [selectedMonth, selectedYear, fetchEnvelopes]);

    const handleCreateEnvelope = () => {
        if (!newEnvelopeName.trim()) return;
        createEnvelope(newEnvelopeName, notify);
        setNewEnvelopeName('');
    };

    const handleUpdateEnvelope = (id) => {
        if (!editedEnvelopeName.trim()) return;
        updateEnvelope(id, editedEnvelopeName, notify);
        setEditingEnvelope(null);
    };

    const handleDeleteEnvelope = (id) => {
        if (window.confirm('Supprimer cette enveloppe ?')) {
            deleteEnvelope(id, notify);
        }
    };

    const handleAddTransaction = (envelopeId) => {
        const {description, amount} = newTransactions[envelopeId] || {};
        if (!description || isNaN(parseFloat(amount))) return;

        addTransaction(
            envelopeId,
            {
                description,
                amount: parseFloat(amount),
                date: new Date(),
            },
            notify
        );

        setNewTransactions((prev) => ({...prev, [envelopeId]: {description: '', amount: ''}}));
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
            const updated = {...prev};
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
        <div>
            <h2>Mes enveloppes ({selectedMonth}/{selectedYear})</h2>

            <div style={{marginBottom: '1rem'}}>
                <label>Mois : </label>
                <select value={selectedMonth} onChange={(e) => setMonth(parseInt(e.target.value))}>
                    {[...Array(12).keys()].map((m) => (
                        <option key={m + 1} value={m + 1}>{m + 1}</option>
                    ))}
                </select>

                <label style={{marginLeft: '1rem'}}>Année : </label>
                <input
                    type="number"
                    value={selectedYear}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    style={{width: '80px'}}
                />
            </div>

            <div style={{marginBottom: '1rem'}}>
                <input
                    type="text"
                    placeholder="Nom de l'enveloppe"
                    value={newEnvelopeName}
                    onChange={(e) => setNewEnvelopeName(e.target.value)}
                />
                <button onClick={handleCreateEnvelope}>➕ Ajouter</button>
            </div>

            {envelopes.map((env) => (
                <div key={env.id} style={{border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem'}}>
                    {editingEnvelope === env.id ? (
                        <>
                            <input
                                type="text"
                                value={editedEnvelopeName}
                                onChange={(e) => setEditedEnvelopeName(e.target.value)}
                            />
                            <button onClick={() => handleUpdateEnvelope(env.id)}>💾</button>
                            <button onClick={() => setEditingEnvelope(null)}>❌</button>
                        </>
                    ) : (
                        <>
                            <h3>{env.name}</h3>
                            <button onClick={() => {
                                setEditingEnvelope(env.id);
                                setEditedEnvelopeName(env.name);
                            }}>✏️
                            </button>
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
                                                    [t.id]: {...prev[t.id], description: e.target.value},
                                                }))
                                            }
                                        />
                                        <input
                                            type="number"
                                            value={editingTransaction[t.id].amount}
                                            onChange={(e) =>
                                                setEditingTransaction((prev) => ({
                                                    ...prev,
                                                    [t.id]: {...prev[t.id], amount: e.target.value},
                                                }))
                                            }
                                        />
                                        <button onClick={() => handleUpdateTransaction(t)}>💾</button>
                                        <button onClick={() =>
                                            setEditingTransaction((prev) => {
                                                const updated = {...prev};
                                                delete updated[t.id];
                                                return updated;
                                            })}>❌
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        {t.description} – {t.amount} €
                                        <button onClick={() =>
                                            setEditingTransaction((prev) => ({
                                                ...prev,
                                                [t.id]: {description: t.description, amount: t.amount},
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
                                    [env.id]: {...prev[env.id], description: e.target.value},
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
                                    [env.id]: {...prev[env.id], amount: e.target.value},
                                }))
                            }
                        />
                        <button onClick={() => handleAddTransaction(env.id)}>➕ Ajouter transaction</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EnvelopeManager;
