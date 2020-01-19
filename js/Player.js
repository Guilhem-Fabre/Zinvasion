
class Player {
    constructor(game, canvas) {
        this.game = game;
        this.canvas = canvas;
        this.scene = this.game.scene;

        this.playerBox = BABYLON.Mesh.CreateBox("headMainPlayer", 2, this.scene);
        this.playerBox.position = new BABYLON.Vector3(0, 10, 0);
        this.playerBox.ellipsoid = new BABYLON.Vector3(2, 2, 2);

        this.angularSensibility = 100;
        this.speed = 1;
        this.controlEnabled = false;
        this.rotEngaged = false;

        this.weapon = new Weapon(this.scene, this.camera);  

        this.initPointerLock(this.canvas);
        this.initCamera(this.scene, this.canvas);
        this.initEvents();                                      
    }

    degToRad = deg => {
        return (Math.PI * deg) / 180;
    }
    
    radToDeg = rad => {
        return (rad * 180) / Math.PI;
    }

    initEvents() {
        window.addEventListener("keyup", evt => {            
            switch(evt.keyCode){
                case 90:
                this.camera.axisMovement[0] = false;
                break;
                case 83:
                this.camera.axisMovement[1] = false;
                break;
                case 81:
                this.camera.axisMovement[2] = false;
                break;
                case 68:
                this.camera.axisMovement[3] = false;
                break;
            }
        }, false);
        
        window.addEventListener("keydown", evt => {
            switch(evt.keyCode){
                case 90:
                this.camera.axisMovement[0] = true;
                break;
                case 83:
                this.camera.axisMovement[1] = true;
                break;
                case 81:
                this.camera.axisMovement[2] = true;
                break;
                case 68:
                this.camera.axisMovement[3] = true;
                break;
            }
        }, false); 

        window.addEventListener("mousemove", evt => {
            if(this.rotEngaged === true){
                this.camera.playerBox.rotation.y += evt.movementX * 0.001 * (this.angularSensibility / 250);
                this.camera.weapon.rotation.y += evt.movementX * 0.001 * (this.angularSensibility / 250);
                var nextRotationX = this.camera.playerBox.rotation.x + (evt.movementY * 0.001 * (this.angularSensibility / 250));
                if( nextRotationX < this.degToRad(90) && nextRotationX > this.degToRad(-90)){
                    this.camera.playerBox.rotation.x += evt.movementY * 0.001 * (this.angularSensibility / 250);
                    this.camera.weapon.rotation.x += evt.movementY * 0.001 * (this.angularSensibility / 250);
                }
            }
        }, false);

        this.canvas.addEventListener("mousedown", evt => {
            if (this.controlEnabled && !this.weponShoot) {
                this.handleUserMouseDown();
            }
        }, false);
                
        this.canvas.addEventListener("mouseup", evt => {
            if (this.controlEnabled && this.weponShoot) {
                this.handleUserMouseUp();
            }
        }, false);
    }

    initPointerLock = canvas => {
        canvas.addEventListener("click", evt => {
            canvas.requestPointerLock = canvas.requestPointerLock
                || canvas.msRequestPointerLock
                || canvas.mozRequestPointerLock
                || canvas.webkitRequestPointerLock;

            if (canvas.requestPointerLock) {
                canvas.requestPointerLock();
            }
        }, false);

        var pointerlockchange = event => {
            this.controlEnabled = document.mozPointerLockElement === canvas
                || document.webkitPointerLockElement === canvas
                || document.msPointerLockElement === canvas
                || document.pointerLockElement === canvas;

            if (!this.controlEnabled) {
                this.rotEngaged = false;
            } else {
                this.rotEngaged = true;
            }
        };
        
        // Event pour changer l'état du pointeur, sous tout les types de navigateur
        document.addEventListener("pointerlockchange", pointerlockchange, false);
        document.addEventListener("mspointerlockchange", pointerlockchange, false);
        document.addEventListener("mozpointerlockchange", pointerlockchange, false);
        document.addEventListener("webkitpointerlockchange", pointerlockchange, false);
    }

    initCamera(scene, canvas) {
        this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 0, -1), scene);
        this.camera.axisMovement = [false,false,false,false];
        this.camera.setTarget(BABYLON.Vector3.Zero());
        //this.camera.attachControl(canvas, true);
        this.camera.playerBox = this.playerBox;  
        this.camera.weapon = this.weapon.mesh;      
        this.camera.parent = this.camera.playerBox;

        this.camera.playerBox.checkCollisions = true;
        this.camera.playerBox.applyGravity = true;

        /*const hitBoxPlayer = BABYLON.Mesh.CreateBox("hitBoxPlayer", 3, scene);
        hitBoxPlayer.parent = this.camera.playerBox;
        hitBoxPlayer.scaling.y = 2;
        hitBoxPlayer.isPickable = true;
        hitBoxPlayer.isMain = true;*/        
    }

    checkMove(ratioFps) {
        const relativeSpeed = this.speed / ratioFps;
        if(this.camera.axisMovement[0]){
            const forward = new BABYLON.Vector3(
                parseFloat(Math.sin(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed, 
                0, 
                parseFloat(Math.cos(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(forward);
            this.camera.weapon.setPositionWithLocalVector(this.camera.playerBox._position);
        }
        if(this.camera.axisMovement[1]){
            const backward = new BABYLON.Vector3(
                parseFloat(-Math.sin(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed, 
                0, 
                parseFloat(-Math.cos(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(backward);
            this.camera.weapon.setPositionWithLocalVector(this.camera.playerBox._position);
        }
        if(this.camera.axisMovement[2]){
            const left = new BABYLON.Vector3(
                parseFloat(Math.sin(parseFloat(this.camera.playerBox.rotation.y) + this.degToRad(-90))) * relativeSpeed, 
                0, 
                parseFloat(Math.cos(parseFloat(this.camera.playerBox.rotation.y) + this.degToRad(-90))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(left);
            this.camera.weapon.setPositionWithLocalVector(this.camera.playerBox._position);
        }
        if(this.camera.axisMovement[3]){
            const right = new BABYLON.Vector3(
                parseFloat(-Math.sin(parseFloat(this.camera.playerBox.rotation.y) + this.degToRad(-90))) * relativeSpeed, 
                0, 
                parseFloat(-Math.cos(parseFloat(this.camera.playerBox.rotation.y) + this.degToRad(-90))) * relativeSpeed
            );
            this.camera.playerBox.moveWithCollisions(right);
            this.camera.weapon.setPositionWithLocalVector(this.camera.playerBox._position);
        }
        this.camera.playerBox.moveWithCollisions(new BABYLON.Vector3(0,(-1.5) * relativeSpeed ,0));        
        this.camera.weapon.setPositionWithLocalVector(this.camera.playerBox._position);
    }

    handleUserMouseDown() {
        this.weapon.fire();
    }
    
    handleUserMouseUp() {
        this.weapon.stopFire();
    }
}
