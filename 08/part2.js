const { readFileSync } = require('fs')

input = readFileSync('input.txt', 'utf-8')

const width = 25
const height = 6
const layerLength = width * height

const black = 0
// const white = 1
const transparent = 2

let layers = []
for (let i = 0; i < input.length; i += layerLength) {
    layers.push(input
        .substr(i, layerLength)
        .split(''))
}

function flattenLayers(top, bottom) {
    return top.map((pixel, i) => {
        return pixel == transparent
            ? bottom[i]
            : pixel
    })
}

function renderPixel(pixel) {
    return pixel == black
        ? '.'
        : "#"
}

function render(layers) {
    return layers
        .reduce(flattenLayers)
        .map(renderPixel)
        .join('')
}

function print(image) {
    for (let i = 0; i < image.length; i += width) {
        console.log(image.substr(i, width))
    }
}

print(
    render(layers)
)
