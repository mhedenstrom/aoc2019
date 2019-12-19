const { readFileSync } = require('fs')

let programCsv = readFileSync('program.csv', 'utf-8').split(',')
