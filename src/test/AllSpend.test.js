import React from 'react';
import {render, screen} from '@testing-library/react';
import AllSpend from '../components/AllSpend';
import useBudgetStore from '../useBudgetStore';

// Mock des fonctions du store Zustand
jest.mock('../useBudgetStore', () => ({
    __esModule: true,
    default: jest.fn(),
}));

// Mock de jsPDF, html2canvas et XLSX
jest.mock('jspdf', () => {
    return {
        jsPDF: jest.fn().mockImplementation(() => ({
            text: jest.fn(),
            rect: jest.fn(),
            save: jest.fn(),
            addImage: jest.fn(),
            autoTable: jest.fn(),
            addPage: jest.fn(),
            setTextColor: jest.fn(),
            setFont: jest.fn(),
            setFontSize: jest.fn(),
            setFillColor: jest.fn(),
            setDrawColor: jest.fn(),
            setLineWidth: jest.fn(),
            line: jest.fn(),
            internal: {
                pageSize: {
                    getWidth: () => 210,
                    getHeight: () => 297
                },
                getNumberOfPages: () => 3
            },
            setPage: jest.fn()
        }))
    };
});

jest.mock('html2canvas', () => jest.fn().mockResolvedValue({
    toDataURL: () => 'data:image/png;base64,mockimage',
    height: 100,
    width: 200,
}));

jest.mock('xlsx', () => {
    const mockSheet = {};
    const mockWriteFile = jest.fn();

    return {
        utils: {
            book_new: jest.fn(() => ({})),
            aoa_to_sheet: jest.fn(() => mockSheet),
            json_to_sheet: jest.fn(() => mockSheet),
            sheet_add_aoa: jest.fn(),
            book_append_sheet: jest.fn()
        },
        writeFile: mockWriteFile
    };
});

jest.mock('../useBudgetStore');

describe('AllSpend Component - logique de calculs visibles', () => {
    beforeEach(() => {
        useBudgetStore.mockReturnValue({
            depenses: [
                {montant: 50, dateTransaction: '2025-06-01', categorie: 'Courses', description: 'Supermarché'},
                {montant: 30, dateTransaction: '2025-06-02', categorie: 'Loisirs', description: 'Cinéma'},
                {montant: 20, dateTransaction: '2025-06-02', categorie: 'Courses', description: 'Boucherie'},
            ],
            monthlySummary: {
                'Juin 2025': {
                    total: 100,
                    categories: {
                        'Courses': 70,
                        'Loisirs': 30
                    }
                },
                'Mai 2025': {
                    total: 150,
                    categories: {
                        'Courses': 100,
                        'Santé': 50
                    }
                }
            },
            categoryColors: {
                'Courses': '#FF0000',
                'Loisirs': '#0000FF',
                'Santé': '#00FF00'
            },
            fetchDepenses: jest.fn(),
            generateMonthlySummary: jest.fn(),
            assignCategoryColors: jest.fn()
        });
    });

    test('affiche correctement les totaux mensuels', () => {
        render(<AllSpend />);
        expect(screen.getByText(/Juin 2025 - Dépense Totale: 100.00 €/i)).toBeInTheDocument();
        expect(screen.getByText(/Mai 2025 - Dépense Totale: 150.00 €/i)).toBeInTheDocument();
    });

    test('affiche les catégories avec leurs couleurs', () => {
        render(<AllSpend />);
        expect(screen.getByText(/Courses: 70.00 €/)).toBeInTheDocument();
        expect(screen.getByText(/Loisirs: 30.00 €/)).toBeInTheDocument();
        expect(screen.getByText(/Santé: 50.00 €/)).toBeInTheDocument();
    });

    test('affiche le graphique avec le bon titre', () => {
        render(<AllSpend />);
        expect(screen.getByText(/Graphique des Dépenses/i)).toBeInTheDocument();
    });

    test('affiche le titre principal', () => {
        render(<AllSpend />);
        expect(screen.getByText(/Toutes vos dépenses/i)).toBeInTheDocument();
    });
});