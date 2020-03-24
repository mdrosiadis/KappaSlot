class Canvas{

    constructor(htmlCanvas){
        this.htmlCanvas = htmlCanvas;
        this.ctx = this.htmlCanvas.getContext('2d');

        this.animations  = [];
        this.renderables = [];
    }

    clear(){
        this.ctx.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
    }

    render(){
        this.clear();

        this.animations.forEach(anim => {if(anim.running)anim.animateFrame();});

        this.renderables.forEach(elm => elm.render(this.ctx));
    }
    
    pushRenderable(renderable){
        this.renderables.push(renderable);
    }

    pushAnimation(animation){
        this.animations.push(animation);
    }
}