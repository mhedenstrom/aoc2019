const { readFileSync } = require('fs')

let input = readFileSync('input.txt', 'utf-8')

let orbitsTree = input
  .split(/\s+/g)
  .filter(s => s.trim())
  .map(o => o.split(")"))
  .reduce((map, [tree, body]) => ({
    ...map,
    [body]: tree,
  }), {})

function path(e) {
  let parent = orbitsTree[e]
  return parent
    ? [...path(parent), parent]
    : []
}

function subpath(path, from) {
  return path.slice(
    path.indexOf(from),
    path.length
  )
}

function transits(path) {
  return path.length - 1
}

youPath = path('YOU')
sanPath = path('SAN')

commonBody = [...sanPath]
  .reverse()
  .find(p => youPath.includes(p))

distance =
  transits(subpath(sanPath, commonBody)) +
  transits(subpath(youPath, commonBody))

console.log(distance)
