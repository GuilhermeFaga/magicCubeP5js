const windowSize = {
    width: 1280,
    height: 720
}

const cubeSize = 50;

let magicCube;

function setup() {
    createCanvas(windowSize.width, windowSize.height, WEBGL);

    magicCube = new MagicCube()

    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            for (let z = 0; z < 3; z++) {
                if (x == 1 && y == 1 && z == 1) continue
                let c = new Cube(new Cords(x, y, z))
                magicCube.addCube(c)
            }
        }
    }
}

function draw() {
    background(100);

    // rotateZ(frameCount * 0.01);
    // rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);
    magicCube.run()
}

class MagicCube {
    constructor() {
        this.cubes = [];
    }

    run(){
        for (let i = 0; i < this.cubes.length; i++) {
          this.cubes[i].run();
        }
    }

    addCube(c) {
        this.cubes.push(c);
    }
}

class Cube {
    constructor(_cords) {
        this.cords = _cords
        this.position = createVector(
            _cords.x * cubeSize,
            _cords.y * cubeSize,
            _cords.z * cubeSize)
    }

    run() {
        this.render()
    }

    render() {
        fill(150)
        push()
        translate(this.position.x, this.position.y, this.position.z)
        box(cubeSize)
        pop()
    }
}

class Cords {
    constructor(_x, _y, _z) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }
}