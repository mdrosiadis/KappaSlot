class RNG{

    static random(){
        return Math.random();
    }
    static randomInt(min, max){
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(RNG.random() * (max - min + 1)) + min;
    }

    static weightedProbabilityIndex(probs){
        var rnd = RNG.random();
        var running = 0.0;

        for(var i in probs){
            running += probs[i];
            if(rnd <= running)
                return i;
        }

        return i;
    }


    static weightedChoice(items, probGetter){
        return items[this.weightedProbabilityIndex(items.map(item => item.prob))];
    }
    
    
}

module.exports = RNG;
/*
for(let i=0; i < 10; i++)
    console.log(RNG.weightedProbabilityIndex([0.2, 0.3, 0.5]));


let items = [
    {
        val: 5,
        prob: 0.2
    },
    {
        val: 10,
        prob: 0.3
    },
    {
        val: 20,
        prob: 0.5
    }
];

console.log(RNG.weightedChoice(items, item => {item.prob;}));
*/