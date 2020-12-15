package main

import (
	"math/big"

	"github.com/wadey/go-rounding"
)

var (
	zero   = big.NewRat(0, 1)
	one    = big.NewRat(1, 1)
	six    = big.NewRat(6, 1)
	twelve = big.NewRat(12, 1)
)

const Precision = 8

// Snowflake simulates the growth of a snowflake using a cellular automaton.
type Snowflake struct {
	Coords       []HexCoord
	Cells        []*big.Rat
	Neighbors    [][]int
	MaxCellValue *big.Rat
	Size         int

	Beta  *big.Rat
	Gamma *big.Rat

	Iterations      int
	BoundaryReached bool

	receptive   []*big.Rat
	unreceptive []*big.Rat
}

// NewSnowflake creates a new snowflake at the beginning of its lifetime.
func NewSnowflake(size int, beta, gamma *big.Rat) *Snowflake {
	snowflake := Snowflake{
		Coords:       []HexCoord{},
		Cells:        []*big.Rat{},
		Neighbors:    [][]int{},
		MaxCellValue: big.NewRat(1, 1),
		Size:         size,

		Beta:  beta,
		Gamma: gamma,

		Iterations:      0,
		BoundaryReached: false,

		receptive:   []*big.Rat{},
		unreceptive: []*big.Rat{},
	}

	center := HexCoord{0, 0}
	coordIndices := make(map[HexCoord]int)
	for i := 0; i < size; i++ {
		for j := 0; j <= i; j++ {
			c := HexCoord{i, j}
			d := c.Dist(center)
			v := new(big.Rat)
			if d == 0 {
				v.Set(one)
			} else if d < size {
				v.Set(beta)
			} else {
				continue
			}

			snowflake.Coords = append(snowflake.Coords, c)
			snowflake.Cells = append(snowflake.Cells, v)
			snowflake.receptive = append(snowflake.receptive, new(big.Rat))
			snowflake.unreceptive = append(snowflake.unreceptive, new(big.Rat))
			coordIndices[c] = len(snowflake.Cells) - 1
		}
	}

	for _, c := range snowflake.Coords {
		indices := []int{}
		neighbors := c.Neighbors()
		neighborsNormalized := []HexCoord{}
		for _, n := range neighbors {
			neighborsNormalized = append(neighborsNormalized, n.Normalize())
		}

		for _, n := range neighborsNormalized {
			j, ok := coordIndices[n]
			if !ok {
				j = -1
			}
			indices = append(indices, j)
		}
		snowflake.Neighbors = append(snowflake.Neighbors, indices)
	}

	return &snowflake
}

// Grow performs one simulation step.
func (s *Snowflake) Grow() bool {
	if s.BoundaryReached {
		return false
	}

	for i, v := range s.Cells {
		rV := s.receptive[i]
		uV := s.unreceptive[i]
		if s.IsReceptive(i) {
			rV.Set(v)
			rV.Add(rV, s.Gamma)
			uV.Set(zero)
		} else {
			rV.Set(zero)
			uV.Set(v)
		}
	}

	diff := new(big.Rat)
	for i, c := range s.Coords {
		// local contribution
		diff.Set(s.unreceptive[i])
		diff.Mul(diff, six)

		// neighbor contribution
		for _, j := range s.Neighbors[i] {
			if j >= 0 {
				diff.Add(diff, s.unreceptive[j])
			} else {
				diff.Add(diff, s.Beta) // boundary condition
			}
		}

		diff.Quo(diff, twelve)

		cV := s.Cells[i]
		cV.Set(s.receptive[i])
		cV.Add(cV, diff)
		rounding.Round(cV, Precision, rounding.HalfUp)
		if cV.Cmp(s.MaxCellValue) >= 0 {
			s.MaxCellValue = cV
		}
		if cV.Cmp(one) >= 0 && c.Dist(HexCoord{0, 0}) >= s.Size-1 {
			s.BoundaryReached = true
		}
	}

	s.Iterations++
	return true
}

// IsIce checks if the given cell is ice or not.
func (s *Snowflake) IsIce(i int) bool {
	v := s.Cells[i]
	return v.Cmp(one) >= 0
}

// IsReceptive checks if the given cell is receptive or not.
func (s *Snowflake) IsReceptive(i int) bool {
	if s.IsIce(i) {
		return true
	}
	for _, j := range s.Neighbors[i] {
		if j < 0 {
			continue
		}
		if s.IsIce(j) {
			return true
		}
	}
	return false
}
