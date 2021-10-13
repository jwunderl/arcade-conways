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

    let width: number;
    let height: number;
    let scale: number
    let updateHandler: (x: number, y: number) => void;

    //% block="on generation update $col $row"
    //% blockId="conwaysOnGenerationUpdate"
    //% draggableParameters="reporter"
    //% group="Game of Life"
    //% weight=50
    export function onGenerationUpdate(handler: (col: number, row: number) => void) {
        updateHandler = handler;
    }

    //% block="set initial state $im"
    //% blockId="conwaysSetInitialState"
    //% group="Game of Life"
    //% im.shadow=game_of_life_image_picker
    //% weight=100
    export function setInitialState(im: Image) {
        scale = 2;
        init(im, true);
    }

    //% blockId=game_of_life_image_picker block="%img"
    //% shim=TD_ID
    //% img.fieldEditor="sprite"
    //% img.fieldOptions.taggedTemplate="img"
    //% img.fieldOptions.decompileIndirectFixedInstances="true"
    //% img.fieldOptions.sizes="80,60"
    //% img.fieldOptions.filter="!dialog !background"
    //% weight=100 group="Create"
    //% blockHidden=1 duplicateShadowOnDrag
    export function _lifeImage(img: Image) {
        return img;
    }

    // buffers[bufferNum][col][row] corresponds to whether the cell at location (col,row)
    // was alive in the given buffer
    let buffers: boolean[][][];
    let currentBuffer: number;

    //% block="next generation"
    //% blockId="conwaysNextGeneration"
    //% group="Game of Life"
    //% weight=90
    export function nextGeneration() {
        init();

        // leave 1 pixel of unused edge on each side
        // to avoid having to deal with oob checking
        for (let col = 0; col < width; ++col) {
            for (let row = 0; row < height; ++row) {
                (updateHandler || applyRules)(col, row);
            }
        }
        
        currentBuffer++;
    }

    //% block="is alive at $col $row"
    //% blockId="conwaysGetState"
    //% group="Game of Life"
    //% weight=80
    export function getState(col: number, row: number) {
        init();
        if (col < 0 || col >= width || row < 0 || row >= height)
            return false;
        const lastGeneration = buffers[currentBuffer % 2];
        return !!lastGeneration[col][row];
    }

    //% block="$dir"
    //% blockId=conwaysDirection
    //% group="Game of Life"
    //% weight=0
    //% shim=TD_ID
    export function conwaysDir(dir: conways.Direction) {
        return dir
    }

    //% block="is alive $dir of $col $row"
    //% blockId="conwaysGetStateInDirection"
    //% dir.shadow=conwaysDirection
    //% group="Game of Life"
    //% weight=75
    export function getStateInDirection(dir: number, col: number, row: number) {
        switch (dir) {
            case conways.Direction.North:
                return getState(col, row - 1);
            case conways.Direction.NorthEast:
                return getState(col + 1, row - 1);
            case conways.Direction.NorthWest:
                return getState(col - 1, row - 1);
            case conways.Direction.South:
                return getState(col, row + 1);
            case conways.Direction.SouthEast:
                return getState(col + 1, row + 1);
            case conways.Direction.SouthWest:
                return getState(col - 1, row + 1);
            case conways.Direction.East:
                return getState(col + 1, row);
            case conways.Direction.West:
                return getState(col - 1, row);
            // Should not hit, but if not direction go for center
            default:
                return getState(col, row);
        }
    }

    //% block="set alive at $col $row $alive"
    //% blockId="conwaysSetState"
    //% group="Game of Life"
    //% weight=90
    export function setState(col: number, row: number, alive: boolean) {
        init();
        if (col < 0 || col >= width || row < 0 || row >= height)
            return;

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
        if (getState(lX, lY)) ++count;
        if (getState(lX, y)) ++count;
        if (getState(lX, rY)) ++count;
        if (getState(x, lY)) ++count;
        if (getState(x, rY)) ++count;
        if (getState(rX, lY)) ++count;
        if (getState(rX, y)) ++count;
        if (getState(rX, rY)) ++count;
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

    function init(im?: Image, forced?: boolean) {
        if (buffers && !forced) return;
        const initState = im || scene.backgroundImage();
        width = initState.width;
        height = initState.height;
        buffers = [[], []];
        for (let x = 0; x < width; x++) {
            buffers[0][x] = [];
            buffers[1][x] = [];
        }

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                buffers[0][x][y] = initState.getPixel(x, y) != 0;
                buffers[1][x][y] = false;
            }
        }

        currentBuffer = 0;
    }

    //% block="create still life $toDisplay col $col row $row"
    //% blockId="conwaysCreateStillLife"
    //% group="Shapes"
    //% inlineInputMode=inline
    //% weight=80
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
    //% blockId="conwaysCreateOscillator"
    //% group="Shapes"
    //% inlineInputMode=inline
    //% weight=60
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
    //% blockId="conwaysCreateMotion"
    //% group="Shapes"
    //% inlineInputMode=inline
    //% weight=40
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
    //% blockId="conwaysCreateOddCell"
    //% group="Shapes"
    //% inlineInputMode=inline
    //% weight=20
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

    //% block="create $count random cells"
    //% blockId="conwaysCreateRandomCells"
    //% group="Shapes"
    //% weight=0
    export function createRandom(count: number) {
        for (let i = 0; i < count; ++i)
            setState(randint(0, width), randint(0, width), true);
    }
}