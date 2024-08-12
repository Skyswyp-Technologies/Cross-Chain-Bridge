// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

interface IBridge {
    function nameToNative(string memory token) external returns (bool);
    function blockBridge() external returns (bool);

    function unblockBridge() external returns (bool);

    function getTokensLocked(
        address tokenAddress
    ) external view returns (uint256);

    function setBridgeFeeAddress(address bridgeFeeAddress_) external;

    function whitelistToken(
        address tokenAddress,
        string memory tokenName
    ) external returns (bool);

    function removeTokenFromWhitelist(
        address tokenAddress
    ) external returns (bool);

    function withdraw(
        uint256 amount,
        string memory tokenName,
        address receiver
    ) external returns (bool);

    function isWhitelistedAdd(address _token) external view returns (bool);

    function isWhitelistedName(
        string memory _token
    ) external view returns (bool);

    function whitelistedTokenAddress(
        string memory name
    ) external view returns (address);

    function whitelistedTokenName(
        address tokenAddress
    ) external returns (string memory);

    function isBlocked() external view returns (bool);

    function bridgeFeePercent() external returns (uint256);

    function bridgeFeeAddress() external returns (address);

    function withdrwaNative(
        uint256 amount,
        address payable _receiver
    ) external returns (bool);

    function withdrawAxl(
        uint256 amount,
        string memory tokenName,
        address receiver
    ) external returns (bool);

    function withdrawNativeAxl(
        uint256 amount,
        address payable _receiver
    ) external returns (bool success);
}
