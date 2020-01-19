class Weapon {
    constructor(scene, camera) {
        this.camera = camera;
        
        this.bottomPosition = new BABYLON.Vector3(0, 10, 0);
        this.topPositionY = -1.5;
        
        this.mesh = BABYLON.Mesh.CreateBox('rocketLauncher', 5, scene);

        this.scaling = new BABYLON.Vector3(1,1,2);
        
        this.parent = camera;

        this.position = this.bottomPosition.clone();
        this.position.y = this.topPositionY;

        this.material = new BABYLON.StandardMaterial('rocketLauncherMat', scene);
        this.material.diffuseColor = new BABYLON.Color3(1,0,0);

        this.mesh.material = this.material;
    }

    fire() {}

    stopFire() {}

};