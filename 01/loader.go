package main

import (
	"bufio"
	"os"
	"strconv"
)

func LoadModules(filename string) ([]Module, error) {
	file, err := os.Open(filename)
	if err != nil {
		return []Module{}, err
	}
	defer file.Close()

	modules := []Module{}

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		mass, err := strconv.Atoi(scanner.Text())
		if err != nil {
			return []Module{}, err
		}

		modules = append(
			modules,
			Module{
				Mass: mass,
			},
		)
	}
	return modules, nil
}
