
const { readFileSync } = require('fs')



const ImmediateMode = 1

const paramCount = [undefined, 3, 3, 1, 1, 2, 2, 3, 3]

class Intcomp {
    
    mode(opcode, i) {
        return Math.floor(opcode / Math.pow(10, i + 2) % 10)
    }
    
    decodeInstruction(pc) {
        let [opcode, ...params] = this.intcode.slice(pc, pc+4)
        let instruction = opcode % 100
        params = params.slice(0, paramCount[instruction])
    
        return {
            instruction,
            length: params.length + 1,
            parameters: params.map((position, i) => ({
                position,
                immediate: this.mode(opcode, i) == ImmediateMode,
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
            default:
                return 1
        }
    }
    
    equals(params) {
        let [a, b] = params.map(this.read)
        let {position} = params[2]
        this.intcode[position] = a == b
            ? 1
            : 0
    }
    
    lessThan(params) {
        let [a, b] = params.map(this.read)
        let {position} = params[2]
        this.intcode[position] = a < b
            ? 1
            : 0
    }
    
    readInput(params) {
        let {position} = params[0]
        this.intcode[position] = this.input.read()
    }
    
    writeOutput(params) {
        let {position} = params[0]
        this.output.write(this.intcode[position])
    }
    
    read({position, immediate}) {
        return immediate
            ? position
            : this.intcode[position]
    }
    
    add(params) {
        this.intcode[params[2].position] = this.read(params[0]) + this.read(params[1])
    }
    
    mul(params) {
        let { position } = params[2]
        this.intcode[position] = this.read(params[0]) * this.read(params[1])
    }
    
    jump(params, condition, instr) {
        let [ p1, p2 ] = params.map(p => this.read(p))
        if (condition(p1)) {
            instr['pc'] = p2
        }
    }
    
    run() {
        this.pc = 0
        do {
            let instruction = this.decodeInstruction(this.pc)
            var exitValue = this.execute(instruction)
            this.pc = instruction.pc !== undefined ? instruction.pc : this.pc + instruction.length
        } while (exitValue == 0)
    }
}

class Pipe {
    constructor() {
        this.xs = []
    }
    read() {
        return this.xs.pop()
    }
    write(x) {
        this.xs.unshift(x)
    }
}

function setupAmplifier(phase, previousAmp) {
    var amp = new Intcomp()
    amp.intcode = readProgram()
    amp.output = new Pipe()
    amp.input = (previousAmp && previousAmp.output) || new Pipe()
    amp.input.write(phase)
    return amp
}

function readProgram() {
    return readFileSync('program.csv', 'utf-8')
        .split(",")
        .map(s => parseInt(s))
}

function amplify(phases) {
    // 3125 settings (5 )

    var a = setupAmplifier(phases[0])
    var b = setupAmplifier(phases[1], a)
    var c = setupAmplifier(phases[2], b)
    var d = setupAmplifier(phases[3], c)
    var e = setupAmplifier(phases[4], d)
    
    a.input.write(0)
    for (let amp of [a,b,c,d,e]) {
        amp.run()
    }
    
    return e.output.read()
}

const flattener = (all = [], some) => [
    ...all,
    ...some,
]

const phases = [0,1,2,3,4]

function maxThrusterSignal(phaseSettings) {
    var signal = 0
    for (let setting of phaseSettings) {
        signal = Math.max(signal, amplify(setting))
    }
    return signal
}

function permutations(xs) {
    let [n, ...rest] = xs

    if (!rest.length) {
        return n !== undefined ? [[n]] : [[]]
    }
 
    return permutations(rest).flatMap(permutation => {
        let xs = []
        for (i = 0; i < permutation.length + 1; i++) {
            let copy = [...permutation]
            copy.splice(i, 0, n)
            xs.push(copy)
        }
        return xs
    })
}

console.log(
    maxThrusterSignal(
        permutations(phases)
    )
)
