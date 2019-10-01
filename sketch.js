const windowSize = {
    width: 1280,
    height: 720
}

const cubeSize = 70;
const cubeD = 3

let magicCube;

function setup() {
    createCanvas(windowSize.width, windowSize.height, WEBGL);

    magicCube = new MagicCube()

    for (let x = 0; x < cubeD; x++) {
        for (let y = 0; y < cubeD; y++) {
            for (let z = 0; z < cubeD; z++) {
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
    // rotateY(frameCount * 0.01);
    rotateY(2.3);
    rotateZ(6.1)
    magicCube.run()
}

function keyPressed() {
    if (key == 'd') {
        magicCube.R()
    }
}

class MagicCube {
    constructor() {
        this.cubes = [];
    }

    run() {
        for (let i = 0; i < this.cubes.length; i++) {
            this.cubes[i].run();
        }
    }

    addCube(_c) {
        this.cubes.push(_c);
    }

    getCubeFromCords(_cords) {
        for (let i = 0; i < this.cubes.length; i++) {
            const cube = this.cubes[i];
            if (cube.cords.isEqualTo(_cords)) {
                return cube
            }
        }
    }

    getCubeFromId(_cords) {
        for (let i = 0; i < this.cubes.length; i++) {
            const cube = this.cubes[i];
            if (cube.id.isEqualTo(_cords)) {
                return cube
            }
        }
    }

    R() {
        let maxI = cubeD - 1;
        var newCords = []
        var sideCords = [
            new Cords(0, 0, maxI / 2),
            new Cords(0, maxI / 2, maxI),
            new Cords(0, maxI, maxI / 2),
            new Cords(0, maxI / 2, 0)
        ]
        var edgeCords = [
            new Cords(0, 0, 0),
            new Cords(0, 0, maxI),
            new Cords(0, maxI, maxI),
            new Cords(0, maxI, 0),
        ]

        for (let i = 0; i < edgeCords.length; i++) {
            var _i = i + 1;
            if (_i >= edgeCords.length)
                _i = 0;
            const cords = edgeCords[_i];
            const oldCords = edgeCords[i];
            newCords.push({
                old: magicCube.getCubeFromCords(oldCords).id,
                new: new Cords(0, cords.y, cords.z)
            })
        }

        for (let i = 0; i < sideCords.length; i++) {
            var _i = i + 1;
            if (_i >= sideCords.length)
                _i = 0;
            const cords = sideCords[_i];
            const oldCords = sideCords[i];
            newCords.push({
                old: magicCube.getCubeFromCords(oldCords).id,
                new: new Cords(0, cords.y, cords.z)
            })
        }

        newCords.forEach(cords => {
            magicCube.getCubeFromId(cords.old).setCords(cords.new)
        });
    }
}

class Cube {
    constructor(_cords) {
        this.cords = _cords
        this.oldCords = _cords
        this.id = _cords
        this.color = color(this.cords.x * 80, this.cords.y * 80, this.cords.z * 80)
    }

    setPos() {
        this.position = createVector(
            this.cords.x * cubeSize,
            this.cords.y * cubeSize,
            this.cords.z * cubeSize)
    }

    setCords(_cords) {
        this.oldCords = this.cords
        this.cords = _cords
    }

    run() {
        this.setPos()
        this.render()
    }

    render() {
        fill(this.color)
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

    isEqualTo(_cords) {
        if (this.x == _cords.x &&
            this.y == _cords.y &&
            this.z == _cords.z)
            return true
        else
            return false
    }
}