import { create } from 'zustand';
import lien from "./components/lien";

const useBudgetStore = create((set, get) => ({
    depenses: [],
    categories: [],
    graphData: [],
    total: 0,
    monthlySummary: {},
    categoryColors: {},

    fetchDepenses: async () => {
        const id = localStorage.getItem("utilisateur");
        const res = await fetch(`${lien.url}action/byuser/${id}`);
        const data = await res.json();
        const total = data.reduce((acc, curr) => acc + parseFloat(curr.montant || 0), 0);
        set({ depenses: data, total });
    },

    fetchCategories: async () => {
        const id = localStorage.getItem("utilisateur");
        const res = await fetch(`${lien.url}categorie/byuser/${id}`);
        const data = await res.json();
        set({ categories: data });
    },

    fetchGraphData: async () => {
        const id = localStorage.getItem("utilisateur");
        const month = localStorage.getItem("month") || "1";
        const year = localStorage.getItem("year") || "2023";
        const res = await fetch(`${lien.url}action/categorie/sum/byUser/${id}/${month}/${year}`);
        const data = await res.json();
        set({ graphData: data });
    },

    generateMonthlySummary: () => {
        const { depenses } = get();
        const summary = {};

        depenses.forEach(({ montant, dateTransaction, categorie }) => {
            const date = new Date(dateTransaction);
            const month = date.toLocaleString("fr-FR", { month: "long", year: "numeric" });

            const montantFloat = parseFloat(montant);
            if (isNaN(montantFloat)) return;

            if (!summary[month]) {
                summary[month] = { total: 0, categories: {} };
            }

            summary[month].total += montantFloat;
            summary[month].categories[categorie] =
                (summary[month].categories[categorie] || 0) + montantFloat;
        });

        set({ monthlySummary: summary });
    },

    assignCategoryColors: () => {
        const { depenses } = get();
        const colors = [
            "#6FA3EF", "#7EDABF", "#F9D56E", "#F7A1C4", "#A38DE3", "#F8A978"
        ];
        const categoryMap = {};
        let index = 0;

        [...new Set(depenses.map(exp => exp.categorie))].forEach(category => {
            categoryMap[category] = colors[index % colors.length];
            index++;
        });

        set({ categoryColors: categoryMap });
    },

    addDepense: async ({ montant, categorie, description, date }, notify) => {
        const jwt = localStorage.getItem("jwt");
        const user = parseInt(localStorage.getItem("utilisateur"));
        const body = {
            montant,
            categorie,
            description,
            user,
            dateTransaction: date.toLocaleDateString("en-CA"),
            jwt
        };

        const res = await fetch(`${lien.url}action`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            notify("Dépense ajoutée", "success");
            await get().fetchDepenses();
            get().generateMonthlySummary();
            get().assignCategoryColors();
            await get().fetchGraphData();
        } else {
            notify("Erreur lors de l'ajout", "error");
        }
    },

    deleteDepense: async (id, notify) => {
        const jwt = localStorage.getItem("jwt");
        const res = await fetch(`${lien.url}action/${id}`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jwt })
        });

        if (res.ok) {
            notify("Dépense supprimée", "success");
            await get().fetchDepenses();
            get().generateMonthlySummary();
            get().assignCategoryColors();
            await get().fetchGraphData();
        } else {
            notify("Erreur suppression", "error");
        }
    }
}));

export default useBudgetStore;
