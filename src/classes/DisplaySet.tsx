export class DisplaySet {
    name: string;
    symbol: string;
    address: string;
    currentPositions: Position[];

    constructor(name: string, symbol: string, address: string, currentPositions: Position[]) {
        this.name = name;
        this.symbol = symbol;
        this.address = address;
        this.currentPositions = currentPositions;
    }
}

export class Position {
    name?: string;
    address: string;
    logoURI?: string;

    constructor(name: string, address: string, logoURI: string) {
        this.name = name;
        this.address = address;
        this.logoURI = logoURI;
    }
}

/*
export class PartialPosition {
    address: string;
    positionValue: number;

    constructor(address: string, positionValue: string) {
        this.address = address;
        this.positionValue = parseInt(positionValue, 16);
    }
}
*/

