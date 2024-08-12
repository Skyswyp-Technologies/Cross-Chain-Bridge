// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract AlphaToken is ERC20, Ownable, ERC20Permit {
    constructor(
        address initialOwner
    )
        ERC20("Alpha Token", "ALPHA")
        Ownable(initialOwner)
        ERC20Permit("Alpha Token")
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
