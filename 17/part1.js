const { Intcomp } = require('./intcomp.js')
const { readFileSync } = require('fs')

let comp = new Intcomp()
comp.memory = readFileSync('program.csv', 'utf-8')
    .split(",")
    .map(s => parseInt(s))
    .reduce((mem, instruction, i) => ({
        ...mem,
        [i]: instruction,
    }), {})
comp.run()

let asciiCharacters = comp.output
    .readAll()
    .reverse()
    .map(c => String.fromCharCode(c))

let lines = asciiCharacters
    .join('')
    .split('\n')
    .map(line => line.split(''))

let scaffoldPoints = lines.flatMap((line, i) => {
    return line.reduce((points, c, j) => {
        if (c == "#") {
            points.push([i,j])
        }
        return points
    }, [])
}, [])

let intersections = scaffoldPoints.filter(([i,j]) => {
    let neighbors = [
        [i+1, j],
        [i-1, j],
        [i, j+1],
        [i, j-1],
    ]

    return neighbors.every(([i,j]) => {
        return scaffoldPoints.some(([k,l]) => {
            return k == i && l == j
        })
    })
})

let alignment = intersections.reduce((sum, [i,j]) => {
    return sum + (i * j)
}, 0)

console.log(alignment)
