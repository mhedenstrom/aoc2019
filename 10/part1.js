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

station = {x: 3, y: 4}

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

let {x,y} = bestStation() // 20,18
console.log([x,y].join(','))
console.log(asteroids.length - 1 - countBlocked({x,y}))