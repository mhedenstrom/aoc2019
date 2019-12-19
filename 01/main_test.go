package main

import (
	"github.com/stretchr/testify/assert"
	"testing"
)

const expectedNumberOfModules = 100

func TestLoadModules(t *testing.T) {
	modules, err := LoadModules("part1.txt")
	assert.NoError(t, err)
	assert.Equal(t, expectedNumberOfModules, len(modules))

	for _, m := range modules {
		assert.True(t, m.Mass > 0)
	}
}

func TestRequiredFuel(t *testing.T) {
	assert.Equal(t, 2, Module{Mass: 12}.RequiredFuel())
	assert.Equal(t, 2, Module{Mass: 14}.RequiredFuel())
	assert.Equal(t, 654, Module{Mass: 1969}.RequiredFuel())
	assert.Equal(t, 33583, Module{Mass: 100756}.RequiredFuel())
}

func TestRequiredFuelRecursive(t *testing.T) {
	assert.Equal(t, 2, RequiredFuelRecursive(14))
	assert.Equal(t, 966, RequiredFuelRecursive(1969))
	assert.Equal(t, 50346, RequiredFuelRecursive(100756))
}
