const shipSize = 100

function probe(x, y) {
  let c = new Intcomp()
  c.load(programCsv)
  c.input.write(x)
  c.input.write(y)
  c.runUntilPause()
  return c.output.read() > 0
} 

function edges(row) {
  let left = 0
  while (!probe(left, row)) {
    left++ // step until probe() returns true
  }

  var low = left
  var high = 10*left // magic number: 10

  var right
  while (low < high) {
    
    right = Math.floor((high + low) / 2) // binary search

    if (!probe(right, row)) {
      // still outside tractor beam
      high = right
    }
    else if (probe(right+1, row)) {
      // too far inside the tractor beam
      low = right + 1
    }
    else {
      // found the edge
      break
    }
  }

  return {
    left,
    right,
  }
}

function fits(row) {
  let {
    left,
    right,
  } = edges(row + (shipSize - 1))
  
  if (!probe(left, row)) {
    return false
  }

  while (!probe(right, row) && right > left) {
    right--
  }

  return (right - left) >= (shipSize - 1)
}

let row = 761 // lista ut genom manuell binärsökning :)

while (!fits(row)) {
  row++
}

console.log(`${
  edges(row + shipSize - 1).left * 10000 + row
}`)
