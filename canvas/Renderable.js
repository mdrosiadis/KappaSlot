function HSLtoRGB(HSL){

    const K = n => (n + HSL.hue / 30) % 12;
    const a = HSL.saturation * Math.min(HSL.lightness, 1 - HSL.lightness);

    const f = n => HSL.lightness - a * Math.max(-1, Math.min(K(n) - 3, 9 - K(n), 1));

    const color = [Math.floor(f(0) * 255), 
                   Math.floor(f(8) * 255), 
                   Math.floor(f(4) * 255)];

    return color;
}

function RGBtoHEX(color){
    let colorString = '#';

    color.forEach(el => colorString += el.toString(16).slice(-2).padStart(2, '0'));

    return colorString;
}


class Renderable{

    constructor(){
        this.hue = 0;
        this.saturation = 0.55;
        this.lightness = 0.50;

        this.rotation = 0;
        this.cx = 200;
        this.cy = 200;
        this.width = 100;
        this.height = 100;
    }
    // constructor();
    render(targetCtx){
        targetCtx.save();
        targetCtx.fillStyle = RGBtoHEX(HSLtoRGB(this));
        targetCtx.translate(this.cx, this.cy);
        targetCtx.rotate(this.rotation);
        targetCtx.fillRect(-Math.floor(this.width / 2), -Math.floor(this.height / 2), this.width, this.height);
        targetCtx.restore();
    }

}
