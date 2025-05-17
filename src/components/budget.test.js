import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Budget } from './Budget';

// 🧪 Mock Chart.js (via react-chartjs-2)
jest.mock('react-chartjs-2', () => ({
    Bar: () => <div data-testid="mock-bar-chart" />,
    Line: () => <div data-testid="mock-line-chart" />,
    Pie: () => <div data-testid="mock-pie-chart" />,
}));

// ✅ Test du formulaire
describe('Budget', () => {
    test("formulaire d'ajout de dépense est présent", () => {
        render(<Budget />);

        // Vérifie les champs
        expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/montant/i)).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument(); // <select>
        expect(screen.getAllByRole('textbox')).toHaveLength(2); // description + date
        expect(screen.getByRole('button', { name: /ajouter/i })).toBeInTheDocument();
    });
});
