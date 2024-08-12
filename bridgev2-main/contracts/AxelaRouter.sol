// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import {IERC20} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol";
import {IBridge} from "../interfaces/IBridge.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract SpheriumAxelarRouter is AxelarExecutable, AccessControl {
    IAxelarGasService public immutable gasService;

    //spherium BridgeV2
    IBridge public bridge;

    //maps the destination chain to an address expected
    mapping(string => string) public destChainToAddress;

    //only allowed source addresses
    mapping(string => bool) sourceAllowed;

    bytes32 public constant ONLY_ADMIN = "ONLY_ADMIN";

    modifier onlySources(string memory source) {
        require(sourceAllowed[source], "unallowed source");
        _;
    }

    /// @notice Emitted when a message is received through _lzReceive.
    /// @param token token to be send
    /// @param _user user to receive funds
    /// @param source Endpoint that sent the message.
    event MessageReceived(
        string token,
        address _user,
        uint256 amount,
        string source
    );
    constructor(
        address gateway_,
        address gasReceiver_
    ) AxelarExecutable(gateway_) {
        gasService = IAxelarGasService(gasReceiver_);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    ///@notice addAllowed will enable spherium bridge to be invoved by multiple routers
    ///@param _address admin address
    function addAAdmin(address _address) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(ONLY_ADMIN, _address);
    }

    ///@notice addBridge will enable spherium bridge to be invoved by multiple routers
    ///@param bridge_ bridge address
    function addBridge(address bridge_) external onlyRole(ONLY_ADMIN) {
        bridge = IBridge(bridge_);
    }

    /**
     * @notice used to deposit nave tokens to the contract
     * @param amount token amount
     * @param tokenAddress destination chain l0 ID
     * @param destChain destination chain
     */
    function deposit(
        uint256 amount,
        address tokenAddress,
        string memory destChain
    ) external payable returns (bool) {
        string memory _destAddress = destChainToAddress[destChain];

        string memory tokenName = bridge.whitelistedTokenName(tokenAddress);

        bytes memory payload = abi.encode(amount, tokenName, msg.sender);

        gasService.payNativeGasForContractCall(
            address(this),
            destChain,
            _destAddress,
            payload,
            msg.sender
        );

        gateway.callContract(destChain, _destAddress, payload);

        return true;
    }

    /**
     * @notice used to deposit nave tokens to the contract
     * @param amount token amount
     * @param destChain destination chain
     */
    function depositNative(
        uint256 amount,
        string memory destChain
    ) external payable returns (bool) {
        require(bridge.isWhitelistedAdd(address(0)), "Native not supported");

        require(msg.value > amount, "eth deficit");

        string memory tokenName = bridge.whitelistedTokenName(address(0));

        bytes memory payload = abi.encode(amount, tokenName, msg.sender);

        string memory _destAddress = destChainToAddress[destChain];

        gasService.payNativeGasForContractCall(
            address(this),
            destChain,
            _destAddress,
            payload,
            msg.sender
        );

        gateway.callContract(destChain, _destAddress, payload);

        return true;
    }

    ///@notice addDestAddress links source to address
    ///@param _destChain destination chain
    ///@param _destAddress destination address
    function addDestAddress(
        string memory _destChain,
        string memory _destAddress
    ) external onlyRole(ONLY_ADMIN) {
        destChainToAddress[_destChain] = _destAddress;
        sourceAllowed[_destAddress] = true;
    }

    // Handles calls created by setAndSend. Updates this contract's value
    function _execute(
        string calldata sourceChain_,
        string calldata sourceAddress_,
        bytes calldata payload_
    ) internal override onlySources(sourceAddress_) {
        (uint256 amount, string memory tokenName, address user) = abi.decode(
            payload_,
            (uint256, string, address)
        );

        if (bridge.nameToNative(tokenName)) {
            bridge.withdrawNativeAxl(amount, payable(user));
        } else {
            bridge.withdrawAxl(amount, tokenName, user);
        }
        emit MessageReceived(tokenName, user, amount, sourceChain_);
    }
}
