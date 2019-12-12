input = `
<x=16, y=-11, z=2>
<x=0, y=-4, z=7>
<x=6, y=4, z=-10>
<x=-3, y=-2, z=-4>
`

function gravity(moon, otherMoon) {
    return {
        dx: Math.sign(otherMoon.x - moon.x),
        dy: Math.sign(otherMoon.y - moon.y),
        dz: Math.sign(otherMoon.z - moon.z),
    }
}

function updateVelocity(moon, otherMoon) {
    let {
        dx,
        dy,
        dz,
    } = gravity(moon, otherMoon)

    return {
        ...moon,
        dx: dx + moon.dx,
        dy: dy + moon.dy,
        dz: dz + moon.dz,
    }
}

function move(moon) {
    let {
        dx,
        dy,
        dz,
    } = moon

    return {
        ...moon,
        x: moon.x + dx,
        y: moon.y + dy,
        z: moon.z + dz,
    }
}

function parseMoon(line) {
    let [x,y,z] = line
        .split(',')
        .flatMap(part => parseInt(
            part.match(/(-?\d+)/g))
        )
    
    let dx = dy = dz = 0

    return {
        x,
        y,
        z,
        dx,
        dy,
        dz,
    }
}

var moons = []

function reset() {
    moons = input
    .split('\n')
    .filter(line => line)
    .map(parseMoon)
}

function potential({x,y,z}) {
    return [x,y,z]
        .map(Math.abs)
        .reduce((sum, n) => sum + n, 0)
}

function kinetic({dx, dy, dz}) {
    return [dx,dy,dz]
        .map(Math.abs)
        .reduce((sum, n) => sum + n, 0)
}

function totalEnergy() {
    return moons.reduce((sum, moon) => sum + kinetic(moon) * potential(moon), 0)
}

function orbit() {
    moons = moons.map((moon, i) => {
        return moons
            .filter((m, j) => j != i)
            .reduce((m, otherMoon) => updateVelocity(m, otherMoon), moon)
    })

    moons = moons.map(move)
}

function equal(state1, state2) {
    return Object
        .getOwnPropertyNames(state1)
        .every(p => state1[p] == state2[p])
}

function period(f) {
    reset()
    var count = 0
    do {
        orbit()
        count++
    } while(moons.some(moon => f(moon) != 0))
    return count * 2
}

function lcm(x, y) {
   return (!x || !y) ? 0 : Math.abs((x * y) / gcd(x, y));
}
 
function gcd(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    while (y) {
        var t = y;
        y = x % y;
        x = t;
    }
    return x;
}

let periods = [
    period(moon => moon.dx),
    period(moon => moon.dy),
    period(moon => moon.dz),
]

console.log(periods.reduce((total, p) => lcm(p, total), 1))

// x = 143166
// y = 54172
// z = 96526

// 374307970285176
