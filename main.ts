
//% weight=99 color="#2d730f" icon="\uf471"
//% block="Life"
//% groups='["Game of Life", "Shapes"]'
namespace conways {
    export enum Direction {
        //% block="north"
        North,
        //% block="north east"
        NorthEast,
        //% block="north west"
        NorthWest,
        //% block="south"
        South,
        //% block="south east"
        SouthEast,
        //% block="south west"
        SouthWest,
        //% block="east"
        East,
        //% block="west"
        West
    }
    export enum StillLife {
        //% block="block"
        Block,
        //% block="beehive"
        Beehive,
        //% block="loaf"
        Loaf,
        //% block="boat"
        Boat,
        //% block="tub"
        Tub
    }

    export enum Oscillator {
        //% block="blinker"
        Blinker,
        //% block="toad"
        Toad,
        //% block="beacon"
        Beacon,
        //% block="pulsar"
        Pulsar,
        //% block="pentadecathlon"
        Pentadecathlon
    }

    export enum Motion {
        //% block="glider"
        Glider,
        //% block="light weight"
        LightWeight,
        //% block="gospers"
        Gospers,
        //% block="simkins"
        Simkins,
        //% block="simkins double"
        SimkinsDouble,
        //% block="engine"
        Engine,
        //% block="block layer"
        BlockLayer
    }

    export enum OddCell {
        //% block="r pentomino"
        RPentomino,
        //% block="die hard"
        DieHard,
        //% block="acorn"
        Acorn
    }

    const width = screen.width;
    const height = screen.height;
    let updateHandler: (x: number, y: number) => void;

    //% block="on generation update $col $row"
    //% draggableParameters="reporter"
    //% group="Game of Life"
    //% weight=50
    export function onGenerationUpdate(handler: (col: number, row: number) => void) {
        updateHandler = handler;
    }

    export function setInitialState(im: Image) {
        
    }

    // buffers[bufferNum][col][row] corresponds to whether the cell at location (col,row)
    // was alive in the given buffer
    let buffers: boolean[][][];
    let currentBuffer: number;

    //% block
    //% group="Game of Life"
    //% weight=100
    export function nextGeneration() {
        init();
        // leave 1 pixel of unused edge on each side
        // to avoid having to deal with oob checking
        for (let col = 1; col < width - 1; ++col) {
            for (let row = 1; row < height - 1; ++row) {
                (updateHandler || applyRules)(col, row);
            }
        }
        
        currentBuffer++;
    }

    //% block="is alive at $col $row"
    //% group="Game of Life"
    //% weight=80
    export function getState(col: number, row: number) {
        init();
        const lastGeneration = buffers[currentBuffer % 2];
        return !!lastGeneration[col][row];
    }

    //% block="is alive $direction of $col $row"
    //% group="Game of Life"
    //% weight=75
    export function getStateInDirection(direction: conways.Direction, col: number, row: number) {
        switch (direction) {
            case Direction.North:
                return getState(col, row - 1);
            case Direction.NorthEast:
                return getState(col + 1, row - 1);
            case Direction.NorthWest:
                return getState(col - 1, row - 1);
            case Direction.South:
                return getState(col, row + 1);
            case Direction.SouthEast:
                return getState(col + 1, row + 1);
            case Direction.SouthWest:
                return getState(col - 1, row + 1);
            case Direction.East:
                return getState(col + 1, row);
            case Direction.West:
                return getState(col - 1, row);
            // Should not hit, but if not direction go for center
            default:
                return getState(col, row);
        }
    }

    //% block="set alive at $col $row $alive"
    //% group="Game of Life"
    //% weight=90
    export function setState(col: number, row: number, alive: boolean) {
        init();

        const lastGeneration = buffers[currentBuffer % 2];
        const currGeneration = buffers[(currentBuffer + 1) % 2];
        const bkgd = scene.backgroundImage();

        if (alive) {
            currGeneration[col][row] = true;
            if (!lastGeneration[col][row]) {
                bkgd.setPixel(col, row, randint(1, 0xd));
            }
        } else {
            currGeneration[col][row] = false;
            if (lastGeneration[col][row]) {
                bkgd.setPixel(col, row, 0);
            }
        }
    }

    function countNeighbors(x: number, y: number): number {
        const lastGeneration = buffers[currentBuffer % 2];
        const lX = x - 1; // left x
        const rX = x + 1; // right x
        const lY = y - 1; // left y
        const rY = y + 1; // right y

        let count = 0;
        if (lastGeneration[lX][lY]) ++count;
        if (lastGeneration[lX][y]) ++count;
        if (lastGeneration[lX][rY]) ++count;
        if (lastGeneration[x][lY]) ++count;
        if (lastGeneration[x][rY]) ++count;
        if (lastGeneration[rX][lY]) ++count;
        if (lastGeneration[rX][y]) ++count;
        if (lastGeneration[rX][rY]) ++count;
        return count;
    }

    export function applyRules(col: number, row: number) {
        const bkgd = scene.backgroundImage();
        const neighbors = countNeighbors(col, row);
        const state = getState(col, row);
        if (getState(col, row) && (neighbors < 2 || neighbors > 3)) {
            // Previously alive cell has died due to under- or over-population
            setState(col, row, false);
        } else if (!getState(col, row) && neighbors == 3) {
            // Previously empty location has new cell born
            setState(col, row, true);
        } else {
            setState(col, row, getState(col, row));
        }
    }

    function init() {
        if (buffers) return;
        const bkgd = scene.backgroundImage();
        buffers = [[], []];
        for (let x = 0; x < width; x++) {
            buffers[0][x] = [];
            buffers[1][x] = [];
            for (let y = 0; y < height; y++) {
                buffers[0][x][y] = bkgd.getPixel(x, y) != 0;
                buffers[1][x][y] = false;
            }
        }

        currentBuffer = 0;
        // Draw a border around screen, as those pixels are counted as 'not alive'
        for (let x = 0; x < width; x++) {
            buffers[0][x][0] = false;
            buffers[0][x][height - 1] = false;
            bkgd.setPixel(x, 0, 1);
            bkgd.setPixel(x, height - 1, 1);
        }
        for (let y = 0; y < height; y++) {
            buffers[0][0][y] = false;
            buffers[0][width - 1][y] = false;
            bkgd.setPixel(0, y, 1);
            bkgd.setPixel(width - 1, y, 1);
        }
    }

    //% block="create still life $toDisplay col $col row $row"
    //% group="Shapes"
    //% inlineInputMode=inline
    export function createStillLife(toDisplay: StillLife,
        col: number,
        row: number,
        src?: Image) {
        if (!src) src = scene.backgroundImage();

        let display: Image;
        switch (toDisplay) {
            case StillLife.Block: {
                display = img`
                1 1
                1 1
            `
                break;
            }
            case StillLife.Beehive: {
                display = img`
                . 1 1 .
                1 . . 1
                . 1 1 .
            `
                break;
            }
            case StillLife.Loaf: {
                display = img`
                . 1 1 .
                1 . . 1
                . 1 . 1
                . . 1 .
            `
                break;
            }
            case StillLife.Boat: {
                display = img`
                1 1 .
                1 . 1
                . 1 .
            `
                break;
            }
            case StillLife.Block: {
                display = img`
                1 1
                1 1
            `
                break;
            }
            case StillLife.Tub: {
                display = img`
                . 1 .
                1 . 1
                . 1 .
            `
                break;
            }
            default: return;
        }
        src.drawImage(display, col, row);
    }

    //% block="create oscillator $toDisplay col $col row $row"
    //% group="Shapes"
    //% inlineInputMode=inline
    export function createOscillator(toDisplay: Oscillator,
        col: number,
        row: number,
        src?: Image) {
        if (!src) src = scene.backgroundImage();

        let display: Image;
        switch (toDisplay) {
            case Oscillator.Blinker: {
                display = img`
                1
                1
                1
            `
                break;
            }
            case Oscillator.Toad: {
                display = img`
                . 1 1 1
                1 1 1 .
            `
                break;
            }
            case Oscillator.Beacon: {
                display = img`
                1 1 . .
                1 1 . .
                . . 1 1
                . . 1 1
            `
                break;
            }
            case Oscillator.Pulsar: {
                display = img`
                . . . . 1 . . . . . 1 . . . .
                . . . . 1 . . . . . 1 . . . .
                . . . . 1 1 . . . 1 1 . . . .
                . . . . . . . . . . . . . . .
                1 1 1 . . 1 1 . 1 1 . . 1 1 1
                . . 1 . 1 . 1 . 1 . 1 . 1 . .
                . . . . 1 1 . . . 1 1 . . . .
                . . . . . . . . . . . . . . .
                . . . . 1 1 . . . 1 1 . . . .
                . . 1 . 1 . 1 . 1 . 1 . 1 . .
                1 1 1 . . 1 1 . 1 1 . . 1 1 1
                . . . . . . . . . . . . . . .
                . . . . 1 1 . . . 1 1 . . . .
                . . . . 1 . . . . . 1 . . . .
                . . . . 1 . . . . . 1 . . . .
            `
                break;
            }
            case Oscillator.Pentadecathlon: {
                display = img`
                1 1 1
                . 1 .
                . 1 .
                1 1 1
                . . .
                1 1 1
                1 1 1
                . . .
                1 1 1
                . 1 .
                . 1 .
                1 1 1
            `
                break;
            }
            default: return;
        }
        src.drawImage(display, col, row);
    }

    //% block="create motion $toDisplay col $col row $row"
    //% group="Shapes"
    //% inlineInputMode=inline
    export function createMotion(toDisplay: Motion,
        col: number,
        row: number,
        src?: Image) {
        if (!src) src = scene.backgroundImage();

        let display: Image;
        switch (toDisplay) {
            case Motion.Glider: {
                display = img`
                . 1 .
                . . 1
                1 1 1
            `
                break;
            }
            case Motion.LightWeight: {
                display = img`
                1 . . 1 .
                . . . . 1
                1 . . . 1
                . 1 1 1 1
            `
                break;
            }
            case Motion.Gospers: {
                display = img`
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . 1 1 . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . 1 1 1 . . . . . . . . . .
                . . . . . . . . . 1 . . . . . . . . . . . . . . . 1 1 . 1 . . . . . 1 1
                . . . . . . . 1 . 1 . . . . 1 1 1 . . . . . . . . 1 . . 1 . . . . . 1 1
                1 1 . . . . 1 . 1 . . . . . . . . . . . . . . . . 1 1 . 1 . . . . . . .
                1 1 . . . 1 . . 1 . . . . . . . 1 . . 1 1 . . 1 1 1 . . . . . . . . . .
                . . . . . . 1 . 1 . . . . . . . 1 . . . 1 . . 1 1 . . . . . . . . . . .
                . . . . . . . 1 . 1 . . . . . . 1 . . 1 . . . . . . . . . . . . . . . .
                . . . . . . . . . 1 . . . . . . . . 1 1 . . . . . . . . . . . . . . . .
            `;
                break;
            }
            case Motion.Simkins: {
                display = img`
                1 1 . . . . . 1 1 . . . . . . . . . . . . . . . . . . . . . . . .
                1 1 . . . . . 1 1 . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . 1 1 . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . 1 1 . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . 1 1 . 1 1 . . . . . .
                . . . . . . . . . . . . . . . . . . . . . 1 . . . . . 1 . . . . .
                . . . . . . . . . . . . . . . . . . . . . 1 . . . . . . 1 . . 1 1
                . . . . . . . . . . . . . . . . . . . . . 1 1 1 . . . 1 . . . 1 1
                . . . . . . . . . . . . . . . . . . . . . . . . . . 1 . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . 1 1 . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . 1 . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . 1 1 1 . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . 1 . . . . . . . . .
            `
                break;
            }
            case Motion.SimkinsDouble: {
                display = img`
                1 1 . . . . . 1 1 . . . . . . . . . . . . . . . . . . . . . . . .
                1 1 . . . . . 1 1 . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . 1 1 . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . 1 1 . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
                . . . . . . . . . . . . . . . . . . . . . . 1 1 . 1 1 . . . . . .
                . . . . . . . . . . . . . . . . . . . . . 1 . . . . . 1 . . . . .
                . . . . . . . . . . . . . . . . . . . . . 1 . . . . . . 1 . . 1 1
                . . . . . . . . . . . . . . . . . . . . . 1 1 1 . . . 1 . . . 1 1
                . . . . . . . . . . . . . . . . . . . . . . . . . . 1 . . . . . .
            `
                break;
            }
            case Motion.Engine: {
                display = img`
                1 1 1 1 1 1 1 1 . 1 1 1 1 1 . . . 1 1 1 . . . . . . 1 1 1 1 1 1 1 . 1 1 1 1 1
            `
                break;
            }
            case Motion.BlockLayer: {
                display = img`
                1 1 1 . 1
                1 . . . .
                . . . 1 1
                . 1 1 . 1
                1 . 1 . 1
            `
                break;
            }
            default: return;
        }

        src.drawImage(display, col, row);
    }

    //% block="create odd cell $toDisplay col $col row $row"
    //% group="Shapes"
    //% inlineInputMode=inline
    export function createOddCell(toDisplay: OddCell,
        col: number,
        row: number,
        src?: Image) {
        if (!src) src = scene.backgroundImage();

        let display: Image;
        switch (toDisplay) {
            case OddCell.RPentomino: {
                display = img`
                . 1 1
                1 1 .
                . 1 .
            `
                break;
            }
            case OddCell.DieHard: {
                display = img`
                . . . . . . 1 .
                . . . . . . . .
                1 1 . . . . 1 .
                . 1 . . . 1 1 1
            `
                break;
            }
            case OddCell.Acorn: {
                display = img`
                . 1 . . . . .
                . . . 1 . . .
                1 1 . . 1 1 1
            `;
                break;
            }
            default: return;
        }

        src.drawImage(display, col, row);
    }

    export function createRandom(count: number) {
        for (let i = 0; i < count; ++i)
            setState(randint(0, width), randint(0, width), true);
    }
}