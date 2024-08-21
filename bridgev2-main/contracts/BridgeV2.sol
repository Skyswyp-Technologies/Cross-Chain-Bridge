// SPDX-License-Identifier: MIT

pragma solidity ^0.8.22;

import {OAppSender, MessagingFee} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OAppSender.sol";
import {OApp} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {OAppReceiver, Origin} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OAppReceiver.sol";
import {OptionsBuilder} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

interface IERC20Mintable {

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);


    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
}

pragma solidity ^0.8.13;

error Token__Not__Whitelisted(address tokenName);
error Native__Transfer__Failed(address _receiver);

contract BridgeV2 is OApp, AccessControl {
    //stores the failed values of a native token incase balance is not enough on dest
    mapping(address => uint256) public failedNativeTransfer;

    mapping(string => bool) public nameToNative;

    using OptionsBuilder for bytes;

    mapping(address => bool) public isWhitelistedAdd;

    mapping(string => bool) public isWhitelistedName;

    mapping(string => address) public whitelistedTokenAddress;

    mapping(address => string) public whitelistedTokenName;

    bool public isBlocked;

    uint256 public bridgeFeePercent;

    string[] private whitelistedTokenNames;

    mapping(string => uint256) public mapWhiltelistTokenNames;

    address payable public bridgeFeeAddress;

    //default gas for dest
    uint128 public defaultGas;

    bytes32 public constant ONLY_ALLOWED = "ONLY_ALLOWED";

    bytes32 public constant ONLY_ADMIN = "ONLY_ADMIN";

    modifier onlyAllowed() {
        _;
    }

    event DEPOSIT(
        uint256 amount,
        address sender,
        address tokenAddress,
        string destChain
    );
    event WITHDRAW(uint256 amount, address sender, address tokenAddress);

    /// @notice Emitted when a message is received through _lzReceive.
    /// @param token token to be send
    /// @param _user user to receive funds
    /// @param senderEid What LayerZero Endpoint sent the message.
    /// @param guid The global unique identier for the packet.
    event MessageReceived(
        string token,
        address _user,
        uint256 amount,
        uint32 senderEid,
        bytes32 guid
    );

    event FailedNative(
        address indexed _user,
        uint256 indexed _amount,
        uint256 _time
    );

    constructor(
        address _endpoint,
        address _owner,
        string memory chainName //the chain this bridge is deplyed: should be nave token initials
    ) OApp(_endpoint, _owner)  Ownable(msg.sender) {

        _grantRole(DEFAULT_ADMIN_ROLE, _owner);
        nameToNative[chainName] = true;
        isWhitelistedAdd[address(0)] = true;
        isWhitelistedName[chainName] = true;
        whitelistedTokenName[address(0)] = chainName;
        whitelistedTokenAddress[chainName] = address(0);
        mapWhiltelistTokenNames[chainName] = whitelistedTokenNames.length;
        whitelistedTokenNames.push(chainName);
        defaultGas = 500000;
        bridgeFeePercent = 5;
    }


    function getMessage(
        uint256 amount,
        address tokenAddress
    ) public view returns (bytes memory payload) {
        string memory tokenName = whitelistedTokenName[tokenAddress];
        payload = abi.encode(tokenName, msg.sender, amount);
    }
    
    function getFee(
        uint32 _dstEid,
        bytes memory _message,
        bytes memory _options
    ) public view returns (MessagingFee memory fee) {
        fee = _quote(_dstEid, _message, _options, false);
    }

    //Functions to block or unblock the bridge
    function blockBridge() external onlyOwner returns (bool) {
        isBlocked = true;
        return true;
    }

    function unblockBridge() external onlyOwner returns (bool) {
        isBlocked = false;
        return true;
    }

    //Function to retreive
    function getTokensLocked(
        address tokenAddress
    ) public view returns (uint256) {
        return IERC20Mintable(tokenAddress).balanceOf(address(this));
    }

    function setBridgeFeeAddress(
        address payable bridgeFeeAddress_
    ) public onlyOwner {
        require(bridgeFeeAddress_ != address(0), "Cannot be address 0");
        bridgeFeeAddress = bridgeFeeAddress_;
    }

    //Whitelisting and Initializing of Tokens
    function whitelistToken(
        address tokenAddress,
        string memory tokenName
    ) external onlyOwner returns (bool) {
        //require(!isWhitelistedAdd[tokenAddress], "Duplicate token");
        //require(!isWhitelistedName[tokenName], "Duplicate token");
        isWhitelistedAdd[tokenAddress] = true;
        isWhitelistedName[tokenName] = true;
        whitelistedTokenName[tokenAddress] = tokenName;
        whitelistedTokenAddress[tokenName] = tokenAddress;
        mapWhiltelistTokenNames[tokenName] = whitelistedTokenNames.length;
        whitelistedTokenNames.push(tokenName);
        return true;
    }

    function removeTokenFromWhitelist(
        address tokenAddress
    ) external onlyOwner returns (bool) {
        if (isWhitelistedAdd[tokenAddress]) {
            string memory tokenName = whitelistedTokenName[tokenAddress];
            delete whitelistedTokenAddress[tokenName];
            delete whitelistedTokenName[tokenAddress];
            uint256 i = mapWhiltelistTokenNames[tokenName];
            string memory lastTokenName = whitelistedTokenNames[
                ((whitelistedTokenNames.length) - 1)
            ];
            mapWhiltelistTokenNames[lastTokenName] = i;
            whitelistedTokenNames[i] = lastTokenName;
            whitelistedTokenNames.pop();
            delete mapWhiltelistTokenNames[tokenName];
            isWhitelistedAdd[tokenAddress] = false;
            isWhitelistedName[tokenName] = false;
            return true;
        } else {
            revert Token__Not__Whitelisted(tokenAddress);
        }
    }

    /// @notice Creates options for executing `lzReceive` on the destination chain.
    /// @param _gas The gas amount for the `lzReceive` execution.
    /// @param _value The msg.value for the `lzReceive` execution.
    /// @return bytes-encoded option set for `lzReceive` executor.
    function getLzReceiveOption(
        uint128 _gas,
        uint128 _value
    ) public pure returns (bytes memory) {
        return
            OptionsBuilder.newOptions().addExecutorLzReceiveOption(
                _gas,
                _value
            );
    }

    function updateContractGas(uint128 _gas) external onlyOwner {
        defaultGas = _gas;
    }

    /**
     * @notice used to deposit native tokens to the contract
     * @param _destEid destination chain l0 ID
     * @param amount token amount
     * @param destChain destination chain
     */
    function depositNative(
        uint32 _destEid,
        uint256 amount,
        string memory destChain
    ) external payable returns (bool) {
        require(isBlocked != true, "blocked");
        require(isWhitelistedAdd[address(0)], "not Whitelisted");

        bytes memory _options = getLzReceiveOption(defaultGas, 0);

        string memory tokenName = whitelistedTokenName[address(0)];

        bytes memory payload = abi.encode(tokenName, msg.sender, amount);

        MessagingFee memory fee = getFee(_destEid, payload, _options);
        require(msg.value >= amount + fee.nativeFee, "not enough balance");

        _lzSend(_destEid, payload, _options, fee, msg.sender);
        emit DEPOSIT(amount, msg.sender, address(0), destChain);
        return true;
    }

  
    /**
     * @notice used to deposit nave tokens to the contract
     * @param _destEid destination chain l0 ID
     * @param amount token amount
     * @param tokenAddress destination chain l0 ID
     * @param destChain destination chain
     */
    function deposit(
        uint32 _destEid,
        uint256 amount,
        address tokenAddress,
        string memory destChain
    ) external payable returns (bool) {
        require(isBlocked != true, "blocked");
        require(
            isWhitelistedAdd[tokenAddress],
            "not Whitelisted"
        );

        IERC20Mintable(tokenAddress).transferFrom(
            msg.sender,
            address(this),
            (amount)
        );

        bytes memory _options = getLzReceiveOption(defaultGas, 0);

        bytes memory payload = getMessage(amount, tokenAddress);

        MessagingFee memory fee = getFee(_destEid, payload, _options);

        require(msg.value >= fee.nativeFee, "not enough fee");
        _lzSend(_destEid, payload, _options, fee, payable(msg.sender));
        emit DEPOSIT(amount, msg.sender, tokenAddress, destChain);
        return true;
    }

    // Withdraw function
    function withdraw(
        uint256 amount,
        string memory tokenName,
        address receiver
    ) private returns (bool) {
        address tokenAddress = whitelistedTokenAddress[tokenName];
        require(!isBlocked, "Bridge is blocked right now");

        uint256 feeAmount = (amount * bridgeFeePercent);
        amount = (amount * 1000) - feeAmount;

        IERC20Mintable(tokenAddress).transfer(receiver, (amount / 1000));
        IERC20Mintable(tokenAddress).transfer(
            bridgeFeeAddress,
            (feeAmount / 1000)
        );

        emit WITHDRAW((amount / 1000), receiver, tokenAddress);
        return true;
    }

    function withdrawAxl(
        uint256 amount,
        string memory tokenName,
        address receiver
    ) external onlyRole(ONLY_ALLOWED) returns (bool) {
        address tokenAddress = whitelistedTokenAddress[tokenName];
        uint256 feeAmount = (amount * bridgeFeePercent);
        amount = (amount * 1000) - feeAmount;

        IERC20Mintable(tokenAddress).transfer(receiver, (amount / 1000));
        IERC20Mintable(tokenAddress).transfer(
            bridgeFeeAddress,
            (feeAmount / 1000)
        );

        emit WITHDRAW((amount / 1000), receiver, tokenAddress);
        return true;
    }

    ///@notice addAllowed will enable spherium bridge to be invoved by multiple routers
    function addAllowed(address _address) external onlyRole(ONLY_ADMIN) {
        _grantRole(ONLY_ALLOWED, _address);
    }

    /**
     * @dev Called when data is received from the protocol. It overrides the equivalent function in the parent contract.
     * Protocol messages are defined as packets, comprised of the following parameters.
     * @param _origin A struct containing information about where the packet came from.
     * @param _guid A global unique identifier for tracking the packet.
     * @param payload Encoded message.
     */
    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata payload,
        address, // Executor address as specified by the OApp.
        bytes calldata // Any extra data or options to trigger on receipt.
    ) internal override {
        // Decode the payload to get the message

        // Extract the sender's EID from the origin
        uint32 senderEid = _origin.srcEid;
        //bytes32 sender = _origin.sender;
        (string memory _token, address user, uint256 amount) = abi.decode(
            payload,
            (string, address, uint256)
        );
        if (nameToNative[_token]) {
            withdrawNative(amount, payable(user));
        } else {
            withdraw(amount, _token, user);
        }
        emit MessageReceived(_token, user, amount, senderEid, _guid);

        //Emit the event
    }

    function withdrawNative(
        uint256 amount,
        address payable _receiver
    ) private returns (bool success) {
        if (amount > address(this).balance) {
            failedNativeTransfer[_receiver] = amount;

            emit FailedNative(_receiver, amount, block.timestamp);
        } else {
            uint256 feeAmount = (amount * bridgeFeePercent);
            amount = (amount * 1000) - feeAmount;
            (success, ) = _receiver.call{value: amount / 1000}("");
            (bool done, ) = bridgeFeeAddress.call{value: feeAmount / 1000}("");
            if (success && done) {
                emit WITHDRAW((amount / 1000), _receiver, address(0));
            } else {
                revert Native__Transfer__Failed(_receiver);
            }
        }
    }

    function withdrawNativeAxl(
        uint256 amount,
        address payable _receiver
    ) external onlyRole(ONLY_ALLOWED) returns (bool success) {
        if (amount > address(this).balance) {
            failedNativeTransfer[_receiver] = amount;

            emit FailedNative(_receiver, amount, block.timestamp);
        } else {
            uint256 feeAmount = (amount * bridgeFeePercent);
            amount = (amount * 1000) - feeAmount;
            (success, ) = _receiver.call{value: amount / 1000}("");
            (bool done, ) = bridgeFeeAddress.call{value: feeAmount / 1000}("");
            if (success && done) {
                emit WITHDRAW((amount / 1000), _receiver, address(0));
            } else {
                revert Native__Transfer__Failed(_receiver);
            }
        }
    }

    //Function to change the bridge fee percentage
    function changeBridgeFee(uint256 value) external onlyOwner returns (bool) {
        //require(value != 0, "Value cannot be 0");
        bridgeFeePercent = value;
        return true;
    }

    //Function to get names of all whitelisted tokens
    function getAllWhitelistedTokenNames()
        external
        view
        returns (string[] memory)
    {
        return whitelistedTokenNames;
    }

    function unlockToken(
        address tokenAddress,
        uint256 amount,
        address receiver
    ) external onlyOwner {
        IERC20Mintable(tokenAddress).transfer(receiver, amount);
    }

    function unlockNative(
        address payable _destinanion,
        uint256 _amount
    ) external onlyOwner returns (bool success) {
        //require(address(this).balance >= _amount, "balance err");
        (success, ) = _destinanion.call{value: _amount}("");
    }

    receive() external payable {}
}
