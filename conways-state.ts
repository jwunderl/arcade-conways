namespace conways {
    /**
     * Gets the "kind" of sprite
     */
    //% shim=KIND_GET
    //% blockId=conwaysState block="$kind"
    //% blockHidden=true
    //% kindNamespace=ConwaysState kindMemberName=kind kindPromptHint="e.g. Alive, Dead, Sick..."
    export function _conwaysState(kind: number): number {
        return kind;
    }
}

namespace ConwaysState {
    let nextKind: number;

    export function create() {
        if (nextKind === undefined) nextKind = 2;
        return nextKind++;
    }

    //% isKind
    export const Dead = 0;

    //% isKind
    export const Alive = 1;

    export function _extendedGameOfLife() {
        return nextKind !== undefined;
    }
}