const { readFileSync } = require('fs')

const PositionMode = 0
const ImmediateMode = 1
const RelativeMode = 2

const paramCount = [undefined, 3, 3, 1, 1, 2, 2, 3, 3, 1]

class Intcomp {
    
    constructor() {
        this.pc = 0
        this.halted = false
        this.paused = false
        this.relativeBase = 0
    }

    mode(opcode, i) {
        let m = Math.floor(opcode / Math.pow(10, i + 2) % 10)
        return m
    }
    
    decodeInstruction(pc) {
        let [opcode, ...params] = [
            this.memory[pc],
            this.memory[pc+1],
            this.memory[pc+2],
            this.memory[pc+3],
        ]
        let instruction = opcode % 100
        params = params.slice(0, paramCount[instruction])

        let x = {
            instruction,
            length: params.length + 1,
            parameters: params.map((position, i) => ({
                position,
                mode: this.mode(opcode, i)
            }))
        }


        return x
    }
    
    execute(instr) {
        let { parameters, instruction } = instr
        switch (instruction) {
            case 99:
                return 1
            case 1:
                this.add(parameters)
                return 0
            case 2:
                this.mul(parameters)
                return 0
            case 3:
                this.readInput(parameters)
                return 0
            case 4:
                this.writeOutput(parameters)
                return 0
            case 5:
                this.jump(parameters, n => n != 0, instr)
                return 0
            case 6:
                this.jump(parameters, n => n == 0, instr)
                return 0
            case 7:
                this.lessThan(parameters)
                return 0
            case 8:
                this.equals(parameters)
                return 0
            case 9:
                this.adjustRel(parameters)
                return 0
            default:
                console.log("bad instruction")
                return 1
        }
    }

    adjustRel(params) {
        this.relativeBase += this.read(params[0])
    }
    
    equals(params) {
        let [a, b] = params.map(x => this.read(x))
        this.write(params[2], a == b
            ? 1
            : 0
        )
    }
    
    lessThan(params) {
        let [a, b] = params.map(x => this.read(x))
        this.write(params[2], a < b
            ? 1
            : 0
        )
    }
    
    readInput(params) {
        console.log("READ")
        let value = this.input.read()
        if (value === undefined) {
            this.paused = true
            return
        }
        this.write(params[0], value)
    }
    
    writeOutput(params) {
        let value = this.read(params[0])
        this.output.write(value)
    }
    
    read({position, mode}) {
        switch (mode) {
            case PositionMode:
                return this.memory[position] || 0
            case ImmediateMode:
                return position
            case RelativeMode:
                return this.memory[position + this.relativeBase] || 0
            default:
                console.log("bad mode")
        }
    }
    
    write({position, mode}, value) {
        if (mode == RelativeMode)
            position += this.relativeBase
        this.memory[position] = value
    }

    add([a, b, to]) {
        this.write(
            to,
            this.read(a) + this.read(b),
        )
    }
    
    mul([a, b, to]) {
        this.write(
            to,
            this.read(a) * this.read(b),
        )
    }
    
    jump(params, condition, instr) {
        let [ p1, p2 ] = params.map(p => this.read(p))
        if (condition(p1)) {
            instr['pc'] = p2
        }
    }
    
    runUntilPause() {
        this.paused = false
        while (!this.paused && !this.halted) {
            this.step()
        }
    }

    step() {
        let instruction = this.decodeInstruction(this.pc)
        this.halted = this.execute(instruction) > 0
        if (this.halted) {
            console.log(`${this.label} HALTED`)
        } else if (!this.paused) {
            this.pc = instruction.pc !== undefined ? instruction.pc : this.pc + instruction.length
        }
    }

    run() {
        while (!this.halted) {
            this.step()
        }
    }
}

function readProgram() {
    return readFileSync('program.csv', 'utf-8')
        .split(",")
        .map(s => parseInt(s))
}

class Pipe {
    constructor() {
        this.xs = []
    }
    read() {
        return this.xs.pop()
    }
    readAll() {
        return [...this.xs]
    }
    write(x) {
        this.xs.unshift(x)
    }
}


let hull = {}

const directions = ['^', '>', 'v', '<']
const [up, right, down, left] = directions

let robot = [0,0]
let path = [robot]
let direction = up

const black = '.'
const white = '#'

// start on white
paint(white)

function color() {
    let [x,y] = robot
    return (hull[x] || {})[y] || black
}

function turnCW() {
    direction = directions[(directions.indexOf(direction) + 1) % directions.length]
}

function turnCCW() {
    direction = directions[((directions.indexOf(direction) - 1) + directions.length) % directions.length]
}

function paint(color) {
    let [x,y] = robot
    hull[x] = {
        ...hull[x],
        [y]: color,
    }
}

function move() {
    let [x,y] = robot

    switch (direction) {
        case up:
            y++
            break
        case down:
            y--
            break
        case left:
            x--
            break
        case right:
            x++
            break
    }

    robot = [x,y]
    path.push([x,y])
}

function envelope() {
    let envel = path.reduce((env, [x,y]) => {
        env.top = env.top !== undefined
            ? Math.max(env.top, y)
            : y
        env.bottom = env.bottom !== undefined
            ? Math.min(env.bottom, y)
            : y
        env.left = env.left !== undefined
            ? Math.min(env.left, x)
            : x
        env.right = env.right !== undefined
            ? Math.max(env.right, x)
            : x
        return env
    }, {})
    envel.top += 3
    envel.bottom -= 3
    envel.left -= 3
    envel.right += 3
    return envel
}

function drawHull() {

    let {
        top,
        bottom,
        left,
        right,
    } = envelope()

    for (let i = top; i >= bottom; i--) {

        let cells = []
        for (let j = left; j <= right; j++) {
            if (j == robot[0] && i == robot[1]) {
                cells.push(direction)
            } else {
                cells.push((hull[j] || {})[i] || black)
            }
        }
        console.log(cells.join(''))
    }

}

var c = new Intcomp()
c.intcode = readProgram()
c.label = "Painting robot"
c.input = new Pipe()
c.output = new Pipe()

c.memory = c.intcode.reduce((mem, instruction, i) => ({
    ...mem,
    [i]: instruction,
}), {})

while(!c.halted) {
    c.run()
}

var blocks = 0
let out = c.output.readAll()
for (let i = 0; i < out.length; i += 3) {
    let tileId = out[i]
    if (tileId == 2) {
        blocks++
    }
}

console.log(blocks)
