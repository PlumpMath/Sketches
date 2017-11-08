/// <reference path="./../../typings/babylon.d.ts" />
/// <reference path="./paddle.js" />
/// <reference path="./ball.js" />

// ToDo: Remove `showBoundingBox` from all bodies

const canvasHolder = document.getElementById('canvas-holder');
const canvas = document.createElement('canvas');
canvas.width = window.innerWidth - 25;
canvas.height = window.innerHeight - 30;
canvasHolder.appendChild(canvas);
const engine = new BABYLON.Engine(canvas, true);

const keyStates = {
    32: false, // SPACE
    37: false, // LEFT
    38: false, // UP
    39: false, // RIGHT
    40: false // DOWN
};
window.addEventListener('keydown', (event) => {
    if (event.keyCode in keyStates)
        keyStates[event.keyCode] = true;
});
window.addEventListener('keyup', (event) => {
    if (event.keyCode in keyStates)
        keyStates[event.keyCode] = false;
});

const createScene = () => {
    const scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());
    scene.collisionsEnabled = true;
    scene.workerCollisions = true;

    const camera = new BABYLON.FreeCamera('mainCamera', new BABYLON.Vector3(0, 20, -60), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    const light = new BABYLON.HemisphericLight('mainLight', new BABYLON.Vector3(0, 1, 0), scene);

    const ground = BABYLON.MeshBuilder.CreateGround('mainGround', {
        width: 32,
        height: 70,
        subdivisions: 2
    }, scene);
    ground.position = BABYLON.Vector3.Zero();
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
        ground,
        BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            friction: 0,
            restitution: 0
        }, scene);

    const leftBar = BABYLON.MeshBuilder.CreateBox('leftBar', {
        width: 2,
        height: 2,
        depth: 70
    }, scene);
    leftBar.position = new BABYLON.Vector3(-15, 1, 0);
    leftBar.physicsImpostor = new BABYLON.PhysicsImpostor(
        leftBar,
        BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            friction: 0,
            restitution: 1
        });

    const rightBar = BABYLON.MeshBuilder.CreateBox('rightBar', {
        width: 2,
        height: 2,
        depth: 70
    }, scene);
    rightBar.position = new BABYLON.Vector3(15, 1, 0);
    rightBar.physicsImpostor = new BABYLON.PhysicsImpostor(
        rightBar,
        BABYLON.PhysicsImpostor.BoxImpostor, {
            mass: 0,
            friction: 0,
            restitution: 1
        });

    return scene;
};
const scene = createScene();
// new BABYLON.Vector3(0, 0.5, -34)

const player_1 = new Paddle('player_1', scene, new BABYLON.Vector3(0, 0.5, -34), 2, false);
const aiPlayer = new Paddle('aiPlayer', scene, new BABYLON.Vector3(0, 0.5, 34), 3, true);
const playingBall = new Ball(scene, new BABYLON.Vector3(0, 0.5, -33), 1);

engine.runRenderLoop(() => {
    playingBall.update(player_1.paddle);
    player_1.update(keyStates, playingBall.ball);
    aiPlayer.update(keyStates, playingBall.ball);
    scene.render();
});