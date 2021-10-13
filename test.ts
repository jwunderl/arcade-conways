namespace SpriteKind {
    export const Corgi = SpriteKind.create()
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    paused = !(paused)
})
function test3() {
    for (let k = 0; k <= 4; k++) {
        conways.createMotion(conways.Motion.Gospers, 15, 2 + k * 25)
    }
}
function test1() {
    conways.createRandom(4000)
}
function test4() {
    conways.setInitialState(img`
        ..............................................................e.................
        .............................................................e..................
        .............................................................e..................
        .............................................................e..................
        ............................................................e...................
        ............................................................e...................
        ...........................................................e....................
        ........................ee.................................e....................
        ........................ee................................e.....................
        .......................e.ee...............................e.....................
        ......................e..ee................eee...........e......................
        .............e.......e...ee...............e..e...........e......................
        .........ee.........e....ee..............e...e...eeeeeeeeeee....................
        ........e.e........e......e............ee....e..e........e..e...................
        .................ee.......ee..........e.....e..e.........e.e....................
        ...............ee..........ee......e.e....ee...e.........ee.....................
        ...........................e.ee....e.eeeee.....e........ee......................
        ...........................e...eeeeeee................eee.......................
        ............................e.....e..e..............ee..e.......................
        ............................e.....e...ee.........eee....e.......................
        .............................e...e......eeeeeeeee.......e.......................
        ..........................eeeeeeeee.....................e...ee..................
        ........................ee......e..e....................e..e..e.................
        .......................e........e...e...................e.e...e.....e...........
        ......................e........e.....e..................ee.....e....ee..........
        .....................e........e.......e..eeeeeeeeee.....e......e....ee..........
        ....................e.......ee.........ee..........ee...e......e....ee..........
        ...................e......ee.........eee.............e.e.......e....ee..........
        ..................e......e.........ee...e..............e.......e...e.e..........
        ..................e.....e........ee......e............e........e...e.e..........
        ..................e....e........e.........e...........e........e...e.e..........
        ..................e..ee........e..........e..........eeeeeee..e....e.e..........
        ..................eee.........e...........e.......eeee.....e..e...e..e..........
        .............................e.............e....ee...e.....e.e....e..e..........
        ............................e..............e...e....e......ee....e...e..........
        ............................e..............e..e.....e......e.....e...e..........
        ............................e...............ee......e....ee.....e....e..........
        .............................e..............ee......e...ee......e....e..........
        .............................e.............ee.......eeee.......e.....e..........
        ...........eee...............e...........ee.e.........e.......e......e..........
        ..........e...ee..............eeeeeeeeeee...e........e........e......e..........
        ...........e....ee..........................e.......e........e.......e..........
        ..................e.........................e.....ee........e........e..........
        ...................e........................e....e.........e.........e..........
        ...................e........................ee.............e.........e..........
        ...................e..........................e...........e..........e..........
        ..............eee.e............................e........ee....eeeeeeee..........
        ..............ee.ee.............................eeeeeeeeeeeeee..................
        ...............eee.e.........................eeeeeeee...........................
        ....................e..................eeeeee...................................
        .....................e............eeeee.........................................
        ......................ee......eeee..............................................
        ........................e...ee..................................................
        .........................eee....................................................
        ........................eeee....................................................
        ........................e...e...................................................
        .........................eeeee..................................................
        ................................................................................
        ................................................................................
        ................................................................................
        `)
    conways.setInitialState(img`
        .................................33.....
        ........33333...................3.......
        ......33.....33.......333......3........
        .....3.........3.....3...3....3.........
        ....33333333...3..33333..3..............
        ...33......33..3.3....3..3..............
        ..3.3.......3..33.....3..3..............
        .3..3..33...3..3......3.3e..............
        3...333.3...3..3.....3..3e..............
        3...33.33...3..33...3..333333...........
        3...333..3..3.3.3...3.3..ee..333........
        3...333.....33...33333...ee....3........
        3....3.3.ee.33....3.e3...ee....3........
        3...3.33e.e.33..33.e3.....e..33........e
        3...3..3....3.33.ee33.....ee3.........e.
        3...3..3...33..ee.3........3e......e.e..
        3...3..3...33.....3......33e.ee....e.eee
        .3..3..3...33.....3.....33.e...eeeeeee..
        ..3.3.33...3.3....3....3....e.....e..e..
        ..3.3333...3..33.3...33.....e.....e...ee
        ...3.33....3....33333........e...e......
        ...33......3.....33.......eeeeeeeee.....
        ....3......3...33.......ee......e..e....
        ...3.3......333..33....e........e...e...
        ...3..3.....33333.....e........e.....e..
        ...3..3....33........e........e.......e.
        ....3......3........e.......ee.........e
        ....3333333........e......ee.........eee
        ..................e......e.........ee...
        ..................e.....e........ee.....
        `)
    conways.setInitialState(img`
        ........................................
        ........................................
        ........................................
        ........................................
        ........................................
        ........................................
        ........................................
        ........................................
        ......111.........111.........111.......
        .......1...........1...........1........
        .......1...........1...........1........
        ......111.........111.........111.......
        ........................................
        ......111.........111.........111.......
        ......111.........111.........111.......
        ........................................
        ......111.........111.........111.......
        .......1...........1...........1........
        .......1...........1...........1........
        ......111.........111.........111.......
        ........................................
        ........................................
        ........................................
        ........................................
        ........................................
        ........................................
        ........................................
        ........................................
        ........................................
        ........................................
        `)
}
function test2() {
    for (let i = 0; i <= 14; i++) {
        for (let j = 0; j <= 5; j++) {
            conways.createOscillator(conways.Oscillator.Pentadecathlon, 8 + 10 * i, 5 + 20 * j)
        }
    }
}
let paused = false
test4()
game.onUpdateInterval(100, function () {
    if (!(paused)) {
        conways.nextGeneration()
    }
})
