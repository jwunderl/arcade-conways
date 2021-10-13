
// test1();
test2();
// test3();

function test1() {
    conways.createRandom(4000);
}

function test2() {
    for (let i = 0; i < 15; ++i) {
        for (let j = 0; j < 6; ++j) {
            conways.createOscillator(conways.Oscillator.Pentadecathlon, 8 + 10 * i, 5 + 20 * j);
        }
    }
}
function test3() {
    for (let i = 0; i < 5; ++i) {
        conways.createMotion(conways.Motion.Gospers, 15, 2 + i * 25);
    }
}

game.onUpdateInterval(100, () => {
    conways.nextGeneration()
});