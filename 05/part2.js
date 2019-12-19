const PositionMode = 0
const ImmediateMode = 1

function mode(opcode, i) {
    return Math.floor(opcode / Math.pow(10, i + 2) % 10)
}

paramCount = [undefined, 3, 3, 1, 1, 2, 2, 3, 3]

function decodeInstruction(pc) {
    [opcode, ...params] = intcode.slice(pc, pc+4)
    instruction = opcode % 100
    params = params.slice(0, paramCount[instruction])

    return {
        instruction,
        length: params.length + 1,
        parameters: params.map((position, i) => ({
            position,
            immediate: mode(opcode, i) == ImmediateMode,
        }))
    }
}

function execute(instr) {
    let {
        parameters,
        instruction,
    } = instr
    switch (instruction) {
        case 99:
            return 1
        case 1:
            add(parameters)
            return 0
        case 2:
            mul(parameters)
            return 0
        case 3:
            readInput(parameters)
            return 0
        case 4:
            writeOutput(parameters)
            return 0
        case 5:
            jump(parameters, n => n != 0, instr)
            return 0
        case 6:
            jump(parameters, n => n == 0, instr)
            return 0
        case 7:
            lessThan(parameters)
            return 0
        case 8:
            equals(parameters)
            return 0
        default:
            return 1
    }
}

function equals(params) {
    let [a, b] = params.map(read)
    let {position} = params[2]
    intcode[position] = a == b
        ? 1
        : 0
}

function lessThan(params) {
    let [a, b] = params.map(read)
    let {position} = params[2]
    intcode[position] = a < b
        ? 1
        : 0
}

function readInput(params) {
    let {position} = params[0]
    intcode[position] = input
}

function writeOutput(params) {
    let {position} = params[0]
    output = intcode[position]
}

function read({position, immediate}) {
    return immediate
        ? position
        : intcode[position]
}

function add(params) {
    intcode[params[2].position] = read(params[0]) + read(params[1])
}

function mul(params) {
    let { position } = params[2]
    intcode[position] = read(params[0]) * read(params[1])
}

function jump(params, condition, instr) {
    let [ p1, p2 ] = params.map(read)
    if (condition(p1)) {
        instr['pc'] = p2
    }
}

let intcode = [
    3,225,1,225,6,6,1100,1,238,225,104,0,1101,86,8,225,1101,82,69,225,101,36,65,224,1001,224,-106,224,4,224,1002,223,8,223,1001,224,5,224,1,223,224,223,102,52,148,224,101,-1144,224,224,4,224,1002,223,8,223,101,1,224,224,1,224,223,223,1102,70,45,225,1002,143,48,224,1001,224,-1344,224,4,224,102,8,223,223,101,7,224,224,1,223,224,223,1101,69,75,225,1001,18,85,224,1001,224,-154,224,4,224,102,8,223,223,101,2,224,224,1,224,223,223,1101,15,59,225,1102,67,42,224,101,-2814,224,224,4,224,1002,223,8,223,101,3,224,224,1,223,224,223,1101,28,63,225,1101,45,22,225,1101,90,16,225,2,152,92,224,1001,224,-1200,224,4,224,102,8,223,223,101,7,224,224,1,223,224,223,1101,45,28,224,1001,224,-73,224,4,224,1002,223,8,223,101,7,224,224,1,224,223,223,1,14,118,224,101,-67,224,224,4,224,1002,223,8,223,1001,224,2,224,1,223,224,223,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,7,677,677,224,102,2,223,223,1005,224,329,1001,223,1,223,1008,226,226,224,1002,223,2,223,1005,224,344,1001,223,1,223,1107,677,226,224,1002,223,2,223,1006,224,359,1001,223,1,223,107,677,677,224,102,2,223,223,1005,224,374,101,1,223,223,1108,677,226,224,102,2,223,223,1005,224,389,1001,223,1,223,1007,677,677,224,1002,223,2,223,1005,224,404,101,1,223,223,1008,677,226,224,102,2,223,223,1005,224,419,101,1,223,223,1108,226,677,224,102,2,223,223,1006,224,434,1001,223,1,223,8,677,226,224,1002,223,2,223,1005,224,449,101,1,223,223,1008,677,677,224,1002,223,2,223,1006,224,464,1001,223,1,223,1108,226,226,224,1002,223,2,223,1005,224,479,1001,223,1,223,1007,226,677,224,102,2,223,223,1005,224,494,1001,223,1,223,1007,226,226,224,102,2,223,223,1005,224,509,101,1,223,223,107,677,226,224,1002,223,2,223,1006,224,524,1001,223,1,223,108,677,677,224,102,2,223,223,1006,224,539,101,1,223,223,7,677,226,224,102,2,223,223,1006,224,554,1001,223,1,223,1107,226,677,224,102,2,223,223,1005,224,569,101,1,223,223,108,677,226,224,1002,223,2,223,1006,224,584,101,1,223,223,108,226,226,224,102,2,223,223,1006,224,599,1001,223,1,223,1107,226,226,224,102,2,223,223,1006,224,614,1001,223,1,223,8,226,677,224,102,2,223,223,1006,224,629,1001,223,1,223,107,226,226,224,102,2,223,223,1005,224,644,101,1,223,223,8,226,226,224,102,2,223,223,1006,224,659,101,1,223,223,7,226,677,224,102,2,223,223,1005,224,674,101,1,223,223,4,223,99,226
]

let input = 5

var pc = 0

do {
    instruction = decodeInstruction(pc)
    exitValue = execute(instruction)
    pc = instruction.pc !== undefined ? instruction.pc : pc + instruction.length
} while (exitValue == 0)

console.log(output)