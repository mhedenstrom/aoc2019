const { readFileSync } = require('fs')

let input = readFileSync('input.txt', 'utf-8')

function depth(e, tree) {
  parent = tree[e]
  return !!parent
    ? 1 + depth(parent, tree)
    : 0
}

let orbitsTree = input
  .split(/\s+/g)
  .filter(s => !!s.trim())
  .map(o => o.split(")"))
  .reduce((map, [orbitsTree, body]) => ({
    ...map,
    [body]: orbitsTree,
  }), {})

checksum = Object
  .values(orbitsTree)
  .map(body => 1 + depth(body, orbitsTree))
  .reduce((sum, x) => sum + x, 0)

console.log(checksum)
