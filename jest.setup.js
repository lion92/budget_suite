// jest.setup.js
jest.mock('react-chartjs-2', () => ({
    Line: () => <div data-testid="mock-line-chart" />,
    Bar: () => <div data-testid="mock-bar-chart" />,
    Pie: () => <div data-testid="mock-pie-chart" />,
}));
// Mock de canvas.getContext pour éviter l'erreur jsdom
HTMLCanvasElement.prototype.getContext = () => {
    return {
        fillRect: () => {},
        clearRect: () => {},
        getImageData: () => ({ data: [] }),
        putImageData: () => {},
        createImageData: () => [],
        setTransform: () => {},
        drawImage: () => {},
        save: () => {},
        fillText: () => {},
        restore: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        closePath: () => {},
        stroke: () => {},
        translate: () => {},
        scale: () => {},
        rotate: () => {},
        arc: () => {},
        fill: () => {},
        measureText: () => ({ width: 0 }),
        transform: () => {},
        rect: () => {},
        clip: () => {},
    };
};
