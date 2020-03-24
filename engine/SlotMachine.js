const RNG = require('./RNG/RNG')

const VIRTUALTERMINAL = true;

class SlotMachine{
    #nWheels;
    #name;
    #entities;
    #paylines;
    #perWheel = 3;
    #board;

    #linesUsed;
    #coinsPerLine = 1;

    MAXCOINS = 10;
    

    constructor(name, wheels, entities, paylines){
        this.#name = name;
        this.#nWheels = wheels;
        this.#entities = entities;
        this.#paylines = paylines;

        this.#board = new Array(this.#nWheels);

        for(let i =0; i < this.#board.length; i++)
            this.#board[i] = new Array(this.#perWheel);

        this.#linesUsed = paylines.length;

        this.spin();
        
    }

    get getName(){
        return this.#name;
    }

    welcomeMessage(){
        console.log(`Welcome to ${this.#name}`);
        this.print();
        console.log("===============");
    }

    print(){
        for(let y = 0; y < this.#perWheel; y++){
            let rend = "";
            for(let wn = 0; wn < this.#nWheels; wn++){
                rend += this.#entities[this.#board[wn][y]].consoleRenderString() + " ";
            }
            console.log(rend);
        }
    }

    spin(){
        for(let wn = 0; wn < this.#nWheels; wn++){
            let probs = this.#entities.map(item => item.prob);
            let probSum = 1.0;
            for(let y = 0; y < this.#perWheel; y++){
                const s = RNG.weightedProbabilityIndex(probs);
                const sprob = this.#entities[s].prob;
                
                this.#board[wn][y] = s;

                /* Not getting the same entity two times in the same wheel*/
                probSum -= sprob;
                probs[s] = 0;
                for(let i in probs)
                    probs[i] *= 1 + sprob / probSum;
            }       
        }

    }

    calculateWinnings(){
        let winnings = 0;

        let isWild = sym => this.#entities[sym].isWild;

        for(let pi = 0; pi < this.#linesUsed; pi++){
            let payline = this.#paylines[pi];
            let symbol = this.#board[0][payline[0]];

            for(var W = 1; W < this.#nWheels; W++){
                let currentSymbol = this.#board[W][payline[W]];

                if(!isWild(symbol) && symbol != currentSymbol && !isWild(currentSymbol))
                    break;

                if(isWild(symbol) && !isWild(currentSymbol))
                    symbol = currentSymbol;
            }
            
            // Get the last wheel that the payline includes
            W--;

            const lineEntity = this.#entities[symbol];

            if(lineEntity.pays[W] != 0){
                const payment = lineEntity.pays[W] * this.#coinsPerLine;
                winnings += payment;

                let paymentString = `Line ${pi + 1}: `;

                for(var li = 0; li <= W; li++){
                    const entity = this.#entities[this.#board[li][payline[li]]];
                    paymentString += entity.consoleRenderString() + " ";
                }
                
                for(; li < this.#nWheels; li++)
                    paymentString += "  ";


                paymentString += ` pays ${lineEntity.pays[W]} x ${this.#coinsPerLine} = ${payment} coins.`;
                console.log(paymentString);
            }
        }
        
        console.log(`Total spin winnings: ${winnings}`);

        return winnings;
    }
}

class SlotEntity{

    constructor(symbol, color, prob, pays, wild = false, scatter = false){
        this.symbol    = symbol;
        this.color     = color;
        this.prob      = prob;
        this.pays      = pays;
        this.isWild    = wild;
        this.isScatter = scatter;
    }

    consoleRenderString(){
        if(VIRTUALTERMINAL)
            return `\x1b[38;5;${this.color}m${this.symbol}\x1b[0m`;

        return `${this.symbol}`;
    }
}


let slot = new SlotMachine(
    "Kappa", 
    5, 
    [
       new SlotEntity("T",  39, 0.20, [  0,  0,   5,   25,  100]),
       new SlotEntity("J",  82, 0.15, [  0,  0,   5,   25,  100]),
       new SlotEntity("Q",  91, 0.15, [  0,  0,   5,   25,  100]),
       new SlotEntity("K", 123, 0.10, [  0,  0,   5,   40,  150]),
       new SlotEntity("A", 196, 0.10, [  0,  0,   5,   40,  150]),
       new SlotEntity("N",  28, 0.10, [  0,  5,  25,  100,  750]),
       new SlotEntity("P", 213, 0.10, [  0,  5,  40,  200, 1000]),
       new SlotEntity("E",  12, 0.06, [  0, 10, 100, 1000, 5000]),
       new SlotEntity("B", 202, 0.04, [  0, 10, 100,  500, 1000], wild = true, scatter = true)       
    ], 
    [
        [ 0, 0, 0, 0, 0],
        [ 1, 1, 1, 1, 1],
        [ 2, 2, 2, 2, 2],
        [ 1, 0, 0, 0, 1],
        [ 1, 2, 2, 2, 1],
        [ 0, 0, 1, 2, 2],
        [ 2, 2, 1, 0, 0],
        [ 0, 1, 2, 1, 0],
        [ 2, 1, 0, 1, 2],
        [ 1, 2, 1, 0, 1]
    ]);


let balance = 0;
slot.welcomeMessage();

process.stdin.on("data", (data) => {
    if(data.length != 2){
        console.log(`Balance ${balance}`);
        process.exit(0);
    }
        
    
    balance -= 10;
    slot.spin();
    slot.print();
    balance += slot.calculateWinnings();
});


