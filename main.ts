
//% weight=99 color="#2d730f" icon="\uf471"
//% block="Life"
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
    scene.setBackgroundImage(image.create(width, height));

    // test1();
    // test2();
    test3();

    function test1() {
        createRandom(4000);
    }

    function test2() {
        for (let i = 0; i < 15; ++i) {
            for (let j = 0; j < 6; ++j) {
                createOscillator(Oscillator.Pentadecathlon, 8 + 10 * i, 5 + 20 * j);
            }
        }
    }
    function test3() {
        for (let i = 0; i < 5; ++i) {
            createMotion(Motion.Gospers, 15, 2 + i * 25);
        }
    }

    // buffers[bufferNum][x][y] corresponds to whether the cell at location (x,y)
    // was alive in the given buffer
    let buffers: boolean[][][];
    let currentBuffer: number;

    export function nextGeneration() {
        init();
        // leave 1 pixel of unused edge on each side
        // to avoid having to deal with oob checking
        for (let x = 1; x < width - 1; ++x) {
            for (let y = 1; y < height - 1; ++y) {
                applyRules(x, y);
            }
        }
        
        currentBuffer++;
    }

    //% block="is alive at $x $y"
    export function getState(x: number, y: number) {
        init();
        const lastGeneration = buffers[currentBuffer % 2];
        return !!lastGeneration[x][y];
    }

    //% block="is alive $direction of $x $y"
    export function getStateInDirection(direction: conways.Direction, x: number, y: number) {
        const lastGeneration = buffers[currentBuffer % 2];
        switch (direction) {
            case Direction.North:
                return getState(x, y - 1);
            case Direction.NorthEast:
                return getState(x + 1, y - 1);
            case Direction.NorthWest:
                return getState(x - 1, y - 1);
            case Direction.South:
                return getState(x, y + 1);
            case Direction.SouthEast:
                return getState(x + 1, y + 1);
            case Direction.SouthWest:
                return getState(x - 1, y + 1);
            case Direction.East:
                return getState(x + 1, y);
            case Direction.West:
                return getState(x - 1, y);
            // Should not hit, but if not direction go for center
            default:
                return getState(x, y);
        }
    }

    //% block="set alive at $x $y $alive"
    export function setState(x: number, y: number, alive: boolean) {
        init();
        const lastGeneration = buffers[currentBuffer % 2];
        const currGeneration = buffers[(currentBuffer + 1) % 2];
        const bkgd = scene.backgroundImage();
        if (alive) {
            currGeneration[x][y] = true;
            if (!lastGeneration[x][y]) {
                bkgd.setPixel(x, y, randint(1, 0xd));
            }
        } else {
            currGeneration[x][y] = false;
            if (lastGeneration[x][y]) {
                bkgd.setPixel(x, y, 0);
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

    function applyRules(x: number, y: number) {
        const bkgd = scene.backgroundImage();
        const neighbors = countNeighbors(x, y);
        const state = getState(x, y);
        if (getState(x, y) && (neighbors < 2 || neighbors > 3)) {
            // Previously alive cell has died due to under- or over-population
            setState(x, y, false);
        } else if (!getState(x, y) && neighbors == 3) {
            // Previously empty location has new cell born
            setState(x, y, true);
        } else {
            setState(x, y, getState(x, y));
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

    export function createStillLife(toDisplay: StillLife,
        x: number,
        y: number,
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
        src.drawImage(display, x, y);
    }

    export function createOscillator(toDisplay: Oscillator,
        x: number,
        y: number,
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
        src.drawImage(display, x, y);
    }

    export function createMotion(toDisplay: Motion,
        x: number,
        y: number,
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

        src.drawImage(display, x, y);
    }

    export function createOddCell(toDisplay: OddCell,
        x: number,
        y: number,
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

        src.drawImage(display, x, y);
    }

    export function createRandom(count: number, src?: Image) {
        if (!src) src = scene.backgroundImage();

        for (let i = 0; i < count; ++i)
            src.setPixel(randint(0, width), randint(0, height), 1);
    }
}