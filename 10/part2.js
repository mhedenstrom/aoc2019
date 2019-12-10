const { readFileSync } = require('fs')

input = readFileSync('input.txt', 'utf-8')

asteroids = input
    .split('\n')
    .filter(l => l)
    .flatMap((line, y) => line
        .split('')
        .reduce((list, c, x) => c == "#"
            ? [
                ...list,
                {x, y},
            ]
            : list, []
        )
    )

function dxdy(p1, p2) {
    return {
        dx: p2.x - p1.x,
        dy: p2.y - p1.y,
    }
}

function sameDirection(t1, t2) {
    return (
        t1.dx * t2.dx >= 0 &&
        t1.dy * t2.dy >= 0
    )
}

function distance({dx, dy}) {
    return (
        Math.abs(dx) +
        Math.abs(dy)
    )
}

function similar(t1, t2) {
    return t1.dx / t1.dy == t2.dx / t2.dy
}

function align(points) {
    let [p1,p2,p3] = points

    t1 = dxdy(p1, p2)
    t2 = dxdy(p1, p3)

    return sameDirection(t1, t2) && similar(t1, t2) && distance(t2) > distance(t1)
}

function isBlocked({x,y}, station) {
    let otherAsteroids = asteroids
        .filter(otherAsteroid => 
            (x != station.x || y != station.y) &&
            (x != otherAsteroid.x || y != otherAsteroid.y)
        )

    return otherAsteroids.some(otherAsteroid => align([
        station,
        otherAsteroid,
        {x, y},
    ]))
}

function detectable(station) {
    return asteroids.filter(a => (a.x != station.x || a.y != station.y) && !isBlocked(a, station))
}

function countBlocked(station) {
    return asteroids.reduce((count, a) => {
        if (isBlocked(a, station)) {
            count++
        }

        return count
    }, 0)
}

function bestStation() {
    return asteroids.reduce((best, station) => {
        if (!best) {
            return station
        }

        return countBlocked(station) < countBlocked(best)
            ? station
            : best
    })
}

let station = {x: 20, y: 18}

function angle({x,y}) {

    let dx = x - station.x
    let dy = y - station.y
    let angle = Math.atan2(dy, dx)

    angle += Math.atan2(1, 0) // start angle
    angle += Math.PI * 2
    angle %= Math.PI * 2
    return angle
}


zappingOrder = detectable(station).sort((a,b) => angle(a) - angle(b))
   
let {x,y} = zappingOrder[199]
console.log(x * 100 + y)