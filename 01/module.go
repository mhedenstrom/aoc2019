package main

import ()

type Module struct {
	Mass int
}

func (m Module) RequiredFuel() int {
	return requiredFuel(m.Mass)
}

func RequiredFuelRecursive(mass int) int {
	fuel := requiredFuel(mass)
	if fuel < 0 {
		return 0
	}

	return fuel + RequiredFuelRecursive(fuel)
}

func requiredFuel(mass int) int {
	return mass/3 - 2
}
