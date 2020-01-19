document.addEventListener("DOMContentLoaded", function () {
    new Game('renderCanvas');
}, false);

class Game {

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.engine = new BABYLON.Engine(this.canvas, true);    
        
        this.scene = this.initScene(this.engine);
        this.player = new Player(this, this.canvas);
        this.arena = new Arena(this);

        this.fps = 0;

        this.setListeners();                
    }

    setListeners() {        
        this.engine.runRenderLoop(() => {

            this.fps = Math.round(1000 / this.engine.getDeltaTime());
            this.player.checkMove(this.fps / 60);

            //console.log(this.fps);
            this.scene.render();                   
        });
    
    
        window.addEventListener("resize", function () {
            if (this.engine) {
                this.engine.resize();
            }
        },false);
    }
    
    initScene = engine => {    
        const scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0,0,0);
        scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
        scene.collisionsEnabled = true;
        return scene;  
    };
};