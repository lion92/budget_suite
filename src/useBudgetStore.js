import { create } from "zustand";

const useBudgetStore = create((set) => ({
    monthlySummary: {},
    setMonthlySummary: (expenses) => {
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
        set({ monthlySummary: summary });
    },
}));

export default useBudgetStore;