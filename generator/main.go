package main

import (
	"fmt"
	"math"
	"math/big"
	"math/rand"
	"runtime"
	"syscall/js"
	"time"

	"github.com/wadey/go-rounding"
)

type params struct {
	Beta  *big.Rat
	Gamma *big.Rat
}

var snowflakes map[string]map[int]*Snowflake
var numSnowflakes = 0

func seedIntFromString(seed string) (int64, error) {
	seedBig, ok := new(big.Int).SetString(seed, 10)
	if !ok {
		return 0, fmt.Errorf("seed '%s' is not a valid integer", seed)
	}

	m := new(big.Int).SetUint64(math.MaxUint64)
	m.Add(m, big.NewInt(1))
	seedBig.Mod(seedBig, m)
	if !seedBig.IsUint64() {
		panic("failed to calculate seed from " + seed)
	}

	seedInt := int64(seedBig.Uint64())
	return seedInt, nil
}

func randBeta(r *rand.Rand) *big.Rat {
	beta := new(big.Rat).SetUint64(r.Uint64())
	beta.Quo(beta, new(big.Rat).SetUint64(math.MaxUint64))
	beta.Mul(beta, big.NewRat(4, 5))
	beta.Add(beta, big.NewRat(1, 5))
	rounding.Round(beta, Precision, rounding.HalfUp)
	return beta
}

func randGamma(r *rand.Rand) *big.Rat {
	gamma := new(big.Rat).SetUint64(r.Uint64())
	gamma.Quo(gamma, new(big.Rat).SetUint64(math.MaxUint64))

	gammaExp := r.Intn(5) + 1
	for i := 0; i < gammaExp; i++ {
		gamma.Mul(gamma, big.NewRat(1, 10))
	}

	return gamma
}

func paramsFromSeed(seed string) (params, error) {
	seedInt, err := seedIntFromString(seed)
	if err != nil {
		return params{}, err
	}
	source := rand.NewSource(seedInt)
	r := rand.New(source)

	beta := randBeta(r)
	gamma := randGamma(r)
	return params{
		Beta:  beta,
		Gamma: gamma,
	}, nil
}

func addSnowflake(seed string, size int) {
	ps, err := paramsFromSeed(seed)
	if err != nil {
		fmt.Printf("error adding snowflake: %s\n", err)
	}

	snowflake := NewSnowflake(size, ps.Beta, ps.Gamma)
	if _, ok := snowflakes[seed]; !ok {
		snowflakes[seed] = make(map[int]*Snowflake)
	}
	if _, ok := snowflakes[seed][size]; !ok {
		numSnowflakes++
	}
	snowflakes[seed][size] = snowflake
}

func addSnowflakeFunc() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) != 2 {
			return fmt.Sprintf("Expected 2 arguments, got %d", len(args))
		}
		seed := args[0].String()
		size := args[1].Int()
		addSnowflake(seed, size)
		return ""
	})
}

func growSnowflakes() {
	for {
		if numSnowflakes <= 0 {
			time.Sleep(100 * time.Millisecond)
		}

		for seed, m := range snowflakes {
			for size, s := range m {
				growing := s.Grow()
				if !growing || s.Iterations%10 == 0 {
					postState(seed, size, s)
				}
				if !growing {
					delete(m, size)
					numSnowflakes--
				}
			}
		}

		runtime.Gosched()
	}
}

func formatMessage(seed string, size int, s *Snowflake) map[string]interface{} {
	v := map[string]interface{}{}
	v["seed"] = seed
	v["size"] = size
	v["iteration"] = s.Iterations
	cv, _ := s.MaxCellValue.Float32()
	v["maxCellValue"] = cv

	cells := []interface{}{}
	for i, v := range s.Cells {
		c := s.Coords[i]
		f, _ := v.Float32()
		p := []interface{}{float32(c[0]), float32(c[1]), f}
		cells = append(cells, p)
	}
	v["cells"] = cells
	return v
}

func postState(seed string, size int, s *Snowflake) {
	v := formatMessage(seed, size, s)
	js.Global().Call("postMessage", js.ValueOf(v))
}

func main() {
	snowflakes = make(map[string]map[int]*Snowflake)
	js.Global().Set("addSnowflake", addSnowflakeFunc())

	growSnowflakes()
}
