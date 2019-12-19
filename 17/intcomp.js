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
        this.input = new Pipe()
        this.output = new Pipe()
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

        return {
            instruction,
            length: params.length + 1,
            parameters: params.map((position, i) => ({
                position,
                mode: this.mode(opcode, i),
            }))
        }
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
        if (!this.halted && !this.paused) {
            this.pc = instruction.pc !== undefined ? instruction.pc : this.pc + instruction.length
        }
    }

    run() {
        while (!this.halted) {
            this.step()
        }
    }
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

module.exports = {
    Pipe,
    Intcomp,
}