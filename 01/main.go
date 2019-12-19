package main

import (
	"fmt"
)

func main() {
	part2()
}

func part1() error {
	modules, err := LoadModules("part1.txt")
	if err != nil {
		return err
	}

	totalFuel := 0
	for _, m := range modules {
		totalFuel += m.RequiredFuel()
	}

	fmt.Printf("required fuel is %d\n", totalFuel)
	return nil
}

func part2() error {
	modules, err := LoadModules("part1.txt")
	if err != nil {
		return err
	}

	totalFuel := 0
	for _, m := range modules {
		totalFuel += RequiredFuelRecursive(m.Mass)
	}
	fmt.Printf("required fuel is %d\n", totalFuel)
	return nil
}
