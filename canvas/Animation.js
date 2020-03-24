class Animation{

    constructor(name, el, func){
        this.name = name;
        this.target = el;
        this.animate = func.bind(this, this.target);
        this.running = true;
    }

    toggle(){
        this.running = !this.running;
    }

}

class AnimationGroup{

    constructor(name, ...animations){
        this.name = name;
        this.animations = animations;
        this.running = true;
    }

    stop(){
        this.running = false;
    }

    activate(){
        this.running = true;
    }

    toggle(){
        this.running = !this.running;
    }

    animateFrame(){
        console.log("Running animateFrame()");
        this.animations.forEach(elm => {if(elm.running)elm.animate()});
    }
}
