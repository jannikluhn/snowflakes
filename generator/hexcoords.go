package main

import (
	"math"

	"github.com/go-gl/mathgl/mgl32"
)

// HexCoord are coordinates in a hexagonal grid.
type HexCoord [2]int

// Neighbors returns the coordinates of the six neighboring hexagons.
func (c HexCoord) Neighbors() []HexCoord {
	return []HexCoord{
		HexCoord{c[0] + 1, c[1]},
		HexCoord{c[0] + 1, c[1] - 1},
		HexCoord{c[0], c[1] - 1},
		HexCoord{c[0] - 1, c[1]},
		HexCoord{c[0] - 1, c[1] + 1},
		HexCoord{c[0], c[1] + 1},
	}
}

// CubeCoords computes the cube coordinates corresponding to the hexagon.
func (c HexCoord) CubeCoords() [3]int {
	return [3]int{c[0], -c[0] - c[1], c[1]}
}

// CartCoords computes the cartesian coordinates of the center of the hexagon.
func (c HexCoord) CartCoords(r float32) mgl32.Vec2 {
	dir1 := mgl32.Vec2{1, 0}
	dir2 := mgl32.Vec2{float32(math.Cos(math.Pi / 3)), -float32(math.Sin(math.Pi / 3))}
	d1 := dir1.Mul(2 * r).Mul(float32(c[0]))
	d2 := dir2.Mul(2 * r).Mul(float32(c[1]))
	return d1.Add(d2)
}

// Dist computes the distance between two hexagons.
func (c HexCoord) Dist(c2 HexCoord) int {
	c1Cube := c.CubeCoords()
	c2Cube := c2.CubeCoords()

	dist := 0
	for i := 0; i < 3; i++ {
		dist += int(math.Abs(float64(c1Cube[i] - c2Cube[i])))
	}
	dist /= 2
	return dist
}

// Rotate60 rotates the coordinate by 60 degrees to the left.
func (c HexCoord) Rotate60() HexCoord {
	cc := c.CubeCoords()
	return HexCoord{-cc[1], -cc[0]}
}

// Normalize normalizes the coordinate.
func (c HexCoord) Normalize() HexCoord {
	for !(c[0] >= 0 && c[1] >= 0) {
		c = c.Rotate60()
	}
	if c[0] > c[1] {
		return c
	}
	return HexCoord{c[1], c[0]}
}
