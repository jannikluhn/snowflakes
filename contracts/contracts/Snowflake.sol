//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Snowflake is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _counter;

    mapping(uint256 => uint256) public mintingTime;
    mapping(uint256 => uint256) public meltingTime;

    constructor() ERC721("Snowflake", "SFL") {
    }

    function mint() public returns (uint256) {
      require(isWinter());
      
      _counter.increment();
      uint256 i = _counter.current();
      bytes32 idBytes = keccak256(abi.encode(blockhash(block.number - 1), i, address(this)));
      uint256 id = uint256(idBytes);
      _mint(msg.sender, id);

      bytes32 meltingSeed = keccak256(abi.encode(id, 123));
      uint256 t = block.timestamp + (2 weeks) + (uint256(meltingSeed) % (2 weeks));
      meltingTime[id] = t;
      mintingTime[id] = block.timestamp;
      
      return id;
    }

    function burn(uint256 id) public {
      require(_exists(id));
      require(isMolten(id) || msg.sender == ownerOf(id));
      meltingTime[id] = 0;
      _burn(id);
    }

    function isMolten(uint256 id) public view returns (bool) {
      require(_exists(id));
      return block.timestamp >= meltingTime[id] || !isWinter();
    }

    function isWinter() public view returns (bool) {
      return block.timestamp < 1614556800;
    }

    function exists(uint256 id) public view returns (bool) {
      return _exists(id);
    }
}