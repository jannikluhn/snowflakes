# Snowflake NFTs

The goal of this project is to bring the winter to Ethereum. It consists of an ERC-721 NFT
contract and corresponding website. Each token represents a unique snowflake. Tokens can be minted
by anyone for free. To visually represent the snowflake, the website uses the token ID as
randomness to seed a generator algorithm.

The algorithm is taken from the paper "A local cellular model for snow crystal growth" by Clifford
A. Reiter (2005). Our implementation is written in Go and compiled to WASM for efficiency.
Nevertheless, the client-side computation in high resolution takes some time. For this reason,
low-resolution previews are shown which usually capture the general shape, but still might differ
in some features.

The contracts can be found in `/contracts`, the website in `/dapp`, and the generator code in
`/generator`.

The contracts are deployed on Goerli at `0x3C6f2ad6727BeAD58B4FB68771aF2ca276f142A3`. The website
is hosted at [http://jannikluhn.github.io/snowflakes](http://jannikluhn.github.io/snowflakes).
