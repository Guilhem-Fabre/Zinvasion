class Arena {
    constructor(game) {
        this.game = game;
        this.scene = game.scene;

        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), this.scene);    
        const ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 2, this.scene);        

        const materialGround = new BABYLON.StandardMaterial("groundTexture", this.scene);
        materialGround.diffuseTexture = new BABYLON.Texture("assets/images/brick.jpg", this.scene);

        ground.checkCollisions = true;
        ground.material = materialGround;

        const box = BABYLON.Mesh.CreateBox("box1", 3, this.scene);
        box.scaling.y = 1;
        box.position = new BABYLON.Vector3(5,((3/2)*box.scaling.y),5);
        box.rotation.y = (Math.PI*45)/180;
        box.checkCollisions = true;

        const boxMaterial = new BABYLON.StandardMaterial("boxTexture", this.scene);
        boxMaterial.diffuseTexture = new BABYLON.Texture("assets/images/wood.jpg", this.scene);
        box.material = boxMaterial;


        this.createSkybox();
    }    

    createSkybox = () => {
        const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size:1000.0 }, this.scene);
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/images/skybox", this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
    }
};