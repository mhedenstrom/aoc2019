
const { readFileSync } = require('fs')



const ImmediateMode = 1

const paramCount = [undefined, 3, 3, 1, 1, 2, 2, 3, 3]

class Intcomp {
    
    constructor() {
        this.pc = 0
        this.halted = false
        this.paused = false
    }

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

         let value = this.input.read()
         console.log(`${this.label} read ${value}`)

         if (value === undefined) {
             this.paused = true
             console.log(`${this.label} PAUSED`)
             return
         }
         this.intcode[position] = value
    }
    
    writeOutput(params) {
        let {position} = params[0]
        this.output.write(this.intcode[position])
        console.log(`${this.label} wrote ${this.intcode[position]}`)
    }
    
    read({position, immediate}) {
        return immediate
            ? position
            : this.intcode[position]
    }
    
    write({position}, value) {
        this.intcode[position] = value
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
        }
        if (!this.paused) {
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
    write(x) {
        this.xs.unshift(x)
    }
}

function setupAmplifier(label, previousAmp) {
    var amp = new Intcomp()
    amp.label = label
    amp.intcode = readProgram()
    amp.output = new Pipe()
    amp.input = (previousAmp && previousAmp.output) || new Pipe()
    return amp
}

function readProgram() {
    return readFileSync('program.csv', 'utf-8')
        .split(",")
        .map(s => parseInt(s))
}

function amplify(phases) {
    // 3125 settings (5 )

    var a = setupAmplifier("A")
    var b = setupAmplifier("B", a)
    var c = setupAmplifier("C", b)
    var d = setupAmplifier("D", c)
    var e = setupAmplifier("E", d)
    
    a.input = e.output // feedback loop

    a.input.write(phases[0])
    b.input.write(phases[1])
    c.input.write(phases[2])
    d.input.write(phases[3])
    e.input.write(phases[4])

    a.input.write(0)

    let amplifiers = [a,b,c,d,e]

    while (!e.halted) {
        amplifiers.forEach(a => !a.halted && a.runUntilPause())
    }
    
    return e.output.read()
}

const phases = [5,6,7,8,9]

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
        // [[9,8,7,6,5]]
        permutations(phases)
    )
)


