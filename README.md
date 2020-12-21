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

Snowflakes "melt" after a random lifetime of two to four weeks or at the start of sprint, whatever
comes first. A melted snowflake will be rendered as a water droplet. The contract allows anyone to
burn them. Once burned, the latest owner will be credited with 100 water tokens, a standard ERC-20
token.

On-chain, the previous block hash and a counter serve as entropy for generating random token IDs.
In theory, this allows precomputing expected snowflakes before (selectively) submitting a minting
transaction and frontrunning as well as grinding attacks by miners. Due to the lack of financial
incentives, these kinds of malicious behavior are deemed unlikely and thus ignored.

The contracts can be found in `/contracts`, the website in `/dapp`, and the generator code in
`/generator`.

The contracts are deployed on Ethereum mainnet at address
[0x9A09750A74403348ca32DE810a0ED41De8243FcC](https://etherscan.io/address/0x9A09750A74403348ca32DE810a0ED41De8243FcC)
and Goerli at address
[0x6076c750C3aD28842D05B9626029bD37067d0058](https://goerli.etherscan.io/address/0x6076c750C3aD28842D05B9626029bD37067d0058).
The website is hosted at
[https://jannikluhn.github.io/snowflakes](https://jannikluhn.github.io/snowflakes).

