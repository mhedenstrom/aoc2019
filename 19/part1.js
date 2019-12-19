var count = 0

for (let x = 0; x < 50; x++) {
    for (let y = 0; y < 50; y++) {
        let c = new Intcomp()
        c.load(programCsv)
        c.input.write(x)
        c.input.write(y)
        c.runUntilPause()
        if (c.output.read() > 0) {
            count++
        }
    }
}

console.log(count)
