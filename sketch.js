const windowSize = {
    width: 1280,
    height: 720
}

const cubeSize = 70;
const cubeD = 3

const Moves = Object.freeze({
    "R": 1, "R_": 2,
    "L": 3, "L_": 4,
    "F": 5, "F_": 6,
    "U": 7, "U_": 8,
    "B": 9, "B_": 10,
    "D": 11, "D_": 12
})


let magicCube;

function setup() {
    createCanvas(windowSize.width, windowSize.height, WEBGL);

    magicCube = new MagicCube()

    for (let x = 0; x < cubeD; x++) {
        for (let y = 0; y < cubeD; y++) {
            for (let z = 0; z < cubeD; z++) {
                // if (x == 1 && y == 1 && z == 1) continue
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
    if (key == 'e') {
        magicCube.makeMove(Moves.R_)
    }
    if (key == 'd') {
        magicCube.makeMove(Moves.R)
    }
    if (key == 'q') {
        magicCube.makeMove(Moves.L_)
    }
    if (key == 'a') {
        magicCube.makeMove(Moves.L)
    }
    if (key == 'z') {
        magicCube.makeMove(Moves.F_)
    }
    if (key == 'x') {
        magicCube.makeMove(Moves.F)
    }
    if (key == '2') {
        magicCube.makeMove(Moves.U_)
    }
    if (key == 'w') {
        magicCube.makeMove(Moves.U)
    }
    if (key == 'r') {
        magicCube.makeMove(Moves.B_)
    }
    if (key == 'f') {
        magicCube.makeMove(Moves.B)
    }
    if (key == 'c') {
        magicCube.makeMove(Moves.D_)
    }
    if (key == 'v') {
        magicCube.makeMove(Moves.D)
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

    makeMove(move) {
        var newPos = Util.getSide(move)

        Util.rotate(move, newPos)

        var newCords = this.createNewCords(newPos, move);

        this.applyNewCords(newCords);
    }

    applyNewCords(newCords) {
        newCords.forEach(cords => {
            magicCube.getCubeFromId(cords.old).setCords(cords.new);
        });
    }

    createNewCords(newPos, move) {
        var newCords = [];
        for (let i = 0; i < cubeD; i++) {
            for (let j = 0; j < cubeD; j++) {
                newCords.push({
                    old: magicCube.getCubeFromCords(Util.getSideCords(move, i, j)).id,
                    new: newPos[i][j]
                });
            }
        }
        return newCords;
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

class Util {
    static rotate(move, matrix) {
        const N = matrix.length - 1;

        var result

        if (move % 2 == 0) {
            result = matrix.map((row, i) =>
                row.map((_val, j) => matrix[N - j][i]).reverse()
            ).reverse();
        } else {
            result = matrix.map((row, i) =>
                row.map((_val, j) => matrix[N - j][i])
            );
        }

        matrix.length = 0;
        matrix.push(...result);
        return matrix;
    }

    static getSideCords(move, i, j) {
        if (move == Moves.R || move == Moves.R_)
            return new Cords(0, i, j)
        if (move == Moves.L || move == Moves.L_)
            return new Cords(cubeD - 1, i, j)
        if (move == Moves.F || move == Moves.F_)
            return new Cords(i, j, 0)
        if (move == Moves.U || move == Moves.U_)
            return new Cords(i, 0, j)
        if (move == Moves.B || move == Moves.B_)
            return new Cords(i, j, cubeD - 1)
        if (move == Moves.D || move == Moves.D_)
            return new Cords(i, cubeD - 1, j)
    }

    static getSide(move) {
        var newPos = []

        for (let i = 0; i < cubeD; i++) {
            var row = []
            for (let j = 0; j < cubeD; j++) {
                row[j] = this.getSideCords(move, i, j)
            }
            newPos.push(row)
        }
        return newPos
    }
}