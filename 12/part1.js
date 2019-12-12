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

var moons = input
    .split('\n')
    .filter(line => line)
    .map(parseMoon)

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

for (let i = 0; i < 1000; i++) {
    orbit()
}

console.log(totalEnergy())