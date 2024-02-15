import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import Budget from "./Budget";

describe('Budget', () => {
    test('Filtre du mois présent', async () => {
        // ARRANGE
        render(<Budget></Budget>)

        // ACT
        // await userEvent.click(screen.getByText('Load Greeting'))

        // ASSERT
        expect(screen.getByRole('mois')).toHaveTextContent('Filtre par mois')
    })
    test('Select du mois présent', async () => {
        // ARRANGE
        render(<Budget></Budget>)

        // ACT
        // await userEvent.click(screen.getByText('Load Greeting'))

        // ASSERT
        expect(screen.getByRole('select_mois')).toBeVisible()
    })

})