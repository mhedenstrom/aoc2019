const { readFileSync } = require('fs')

const layerSize = 25 * 6

image = readFileSync('input.txt', 'utf-8').split('')

function countDigits(count, digit) {
    count[digit]++
    return count
}

let layer = undefined
for (let i = 0; i < image.length; i += layerSize) {
    let [
        zeros,
        ones,
        twos,
    ] = image
        .slice(
            i,
            i + layerSize,
        )
        .reduce(
            countDigits,
            [0, 0, 0],
        )

    if (!layer || zeros < layer.zeros) {
        layer = {
            zeros,
            product: ones * twos,
        }
    }
}

console.log(layer.product)
