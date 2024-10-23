// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {IERC20Metadata} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title IPriceOracle
 * @notice Defines the basic interface for a Price oracle.
 */
interface IPriceOracle {
    /**
     * @notice Returns the asset price in the base currency
     * @param asset The address of the asset
     * @return The price of the asset
     */
    function getAssetPrice(address asset) external view returns (uint256);

    /**
     * @notice Set the price of the asset
     * @param asset The address of the asset
     * @param price The price of the asset
     */
    function setAssetPrice(address asset, uint256 price) external;
}

interface IPoolToken {
    function mint(address to, uint256 amount) external;

    function burn(address to, uint256 amount) external;

    function balanceOfUser(address account) external view returns (uint256);
}

error TransferFailed();
error InsufficientTokenAmount();
error InsufficientLiquidity();
error InvalidAmount();
error TokenNotSupported();
error UserAddressNotFound();

contract Pool is
    Initializable,
    UUPSUpgradeable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable
{
    IPriceOracle private oracle;
    address[] public lenders;
    address[] public borrowers;

    mapping(address => mapping(address => uint256)) public tokensLentAmount;
    mapping(address => mapping(address => uint256)) public tokensBorrowedAmount;

    mapping(uint256 => mapping(address => address)) public tokensLent;
    mapping(uint256 => mapping(address => address)) public tokensBorrowed;

    mapping(address => address) public tokenToPriceFeed;

    mapping(uint256 => mapping(address => address)) public tokensLentOrBorrowed;

    event Withdraw(
        address sender,
        uint256 amount,
        uint256 tokenToWithdrawInDollars,
        uint256 availableToWithdraw,
        uint256 totalAmountLentInDollars,
        uint256 PoolTokenToRemove
    );
    event PayDebt(
        address sender,
        int256 index,
        uint256 tokenAmountBorrowed,
        uint256 totalTokenAmountToCollectFromUser,
        address[] borrowers
    );
    event Borrow(
        address sender,
        uint256 amountInDollars,
        uint256 totalAmountAvailableForBorrowInDollars,
        bool userPresent,
        int256 userIndex,
        address[] borrowers,
        uint256 currentUserTokenBorrowedAmount
    );
    event Supply(
        address sender,
        address[] lenders,
        uint256 currentUserTokenLentAmount
    );
    event WithdrawTesting(
        address sender,
        uint256 tokentoWithdrawInDollars,
        uint256 availableToWithdraw
    );
    event BorrowTesting1(
        address sender,
        uint256 amountInDollars,
        uint256 totalAmountAvailableForBorrowInDollars
    );
    event BorrowTesting2(address sender, uint256 balance, uint256 amount);
    event RepayTesting1(address sender, int256 index);
    event RepayTesting2(address sender, uint256 tokenBorrowed);

    struct Token {
        address tokenAddress;
        uint256 LTV;
        uint256 stableRate;
        string name;
    }

    Token[] public tokensForLending;
    Token[] public tokensForBorrowing;

    uint256 public noOfTokensLent;
    uint256 public noOfTokensBorrowed;

    function initialize(address _initialOwner) external initializer {
        UUPSUpgradeable.__UUPSUpgradeable_init();
        _transferOwnership(_initialOwner);
        noOfTokensLent = 0;
        noOfTokensBorrowed = 0;
    }

    function _authorizeUpgrade(
        address newImplementation
    ) internal virtual override onlyOwner {}

    function addPriceFeed(address _oracle) public onlyOwner {
        oracle = IPriceOracle(_oracle);
    }

    function addTokensForLending(
        string memory name,
        address tokenAddress,
        uint256 LTV,
        uint256 borrowStableRate
    ) public onlyOwner {
        Token memory token = Token(tokenAddress, LTV, borrowStableRate, name);

        if (!tokenIsAlreadyThere(token, tokensForLending)) {
            tokensForLending.push(token);
        }
    }

    function addTokensForBorrowing(
        string memory name,
        address tokenAddress,
        uint256 LTV,
        uint256 borrowStableRate
    ) public onlyOwner {
        Token memory token = Token(tokenAddress, LTV, borrowStableRate, name);

        if (!tokenIsAlreadyThere(token, tokensForBorrowing)) {
            tokensForBorrowing.push(token);
        }
    }

    function addTokenToPriceFeedMapping(
        address tokenAddress,
        address tokenToUsdPriceFeed
    ) public onlyOwner {
        tokenToPriceFeed[tokenAddress] = tokenToUsdPriceFeed;
    }

    function supply(
        address tokenAddress,
        uint256 amount
    ) external payable nonReentrant {
        if (!tokenIsAllowed(tokenAddress, tokensForLending)) {
            revert TokenNotSupported();
        }
        if (amount == 0) revert InvalidAmount();

        IERC20 token = IERC20(tokenAddress);

        if (token.balanceOf(msg.sender) < amount)
            revert InsufficientTokenAmount();

        token.transferFrom(msg.sender, address(this), amount);

        (bool userPresent, int256 userIndex) = isUserPresentIn(
            msg.sender,
            lenders
        );

        if (userPresent) {
            updateUserTokensBorrowedOrLent(
                tokenAddress,
                amount,
                userIndex,
                "lenders"
            );
        } else {
            lenders.push(msg.sender);
            tokensLentAmount[tokenAddress][msg.sender] = amount;
            tokensLent[noOfTokensLent++][msg.sender] = tokenAddress;
        }

        emit Supply(
            msg.sender,
            lenders,
            tokensLentAmount[tokenAddress][msg.sender]
        );
    }

    function borrow(
        uint256 amount,
        address tokenAddress
    ) external nonReentrant {
        if (!tokenIsAllowed(tokenAddress, tokensForLending)) {
            revert TokenNotSupported();
        }
        if (amount == 0) revert InvalidAmount();

        uint256 totalAmountAvailableForBorrowInDollars = getUserTotalAmountAvailableForBorrowInDollars(
                msg.sender
            );
        uint256 amountInDollars = getAmountInDollars(amount, tokenAddress);

        emit BorrowTesting1(
            msg.sender,
            amountInDollars,
            totalAmountAvailableForBorrowInDollars
        );

        require(
            amountInDollars <= totalAmountAvailableForBorrowInDollars,
            "You don't have enough collateral to borrow this amount"
        );

        IERC20 token = IERC20(tokenAddress);

        emit BorrowTesting2(msg.sender, token.balanceOf(address(this)), amount);

    if (token.balanceOf(address(this)) < amount) revert InsufficientLiquidity();

        token.transfer(msg.sender, amount);

        (bool userPresent, int256 userIndex) = isUserPresentIn(
            msg.sender,
            borrowers
        );

        if (userPresent) {
            updateUserTokensBorrowedOrLent(
                tokenAddress,
                amount,
                userIndex,
                "borrowers"
            );
        } else {
            borrowers.push(msg.sender);
            tokensBorrowedAmount[tokenAddress][msg.sender] = amount;
            tokensBorrowed[noOfTokensBorrowed++][msg.sender] = tokenAddress;
        }

        emit Borrow(
            msg.sender,
            amountInDollars,
            totalAmountAvailableForBorrowInDollars,
            userPresent,
            userIndex,
            borrowers,
            tokensBorrowedAmount[tokenAddress][msg.sender]
        );
    }

    function payDebt(
        address tokenAddress,
        uint256 amount
    ) external nonReentrant {
        if (amount == 0) revert InvalidAmount();

        int256 index = indexOf(msg.sender, borrowers);

        emit RepayTesting1(msg.sender, index);
        require(index >= 0, "User address not found");

        uint256 tokenBorrowed = tokensBorrowedAmount[tokenAddress][msg.sender];

        emit RepayTesting2(msg.sender, tokenBorrowed);

        require(tokenBorrowed > 0, "You  are not owing");
        IERC20 token = IERC20(tokenAddress);

        uint256 totalTokenAmountToCollectFromUser = amount +
            interest(tokenAddress, amount);

        token.transferFrom(
            msg.sender,
            address(this),
            totalTokenAmountToCollectFromUser
        );

        tokensBorrowedAmount[tokenAddress][msg.sender] =
            tokensBorrowedAmount[tokenAddress][msg.sender] -
            amount;

        // Check If all the amount borrowed = 0;
        uint256 totalAmountBorrowed = getTotalAmountBorrowedInDollars(
            msg.sender
        );

        if (totalAmountBorrowed == 0) {
            borrowers[uint256(index)] = borrowers[borrowers.length - 1];
            borrowers.pop();
        }

        emit PayDebt(
            msg.sender,
            index,
            tokenBorrowed,
            totalTokenAmountToCollectFromUser,
            borrowers
        );
    }

    function withdraw(
        address tokenAddress,
        uint256 amount
    ) external nonReentrant {
        if (amount == 0) revert InvalidAmount();

        int256 index = indexOf(msg.sender, lenders);
        require(index >= 0, "User address not found");

        IERC20 token = IERC20(tokenAddress);

        uint256 tokenToWithdrawInDollars = getAmountInDollars(
            amount,
            tokenAddress
        );
        uint256 availableToWithdraw = getTokenAvailableToWithdraw(msg.sender);

        uint256 decimals = IERC20Metadata(tokenAddress).decimals();

        uint totalTokenSuppliedInContract = getTotalTokenSupplied(
            tokenAddress
        ) * 10 ** decimals;
        uint totalTokenBorrowedInContract = getTotalTokenBorrowed(
            tokenAddress
        ) * 10 ** decimals;

        require(
            amount <=
                (totalTokenSuppliedInContract - totalTokenBorrowedInContract)
        );

        emit WithdrawTesting(
            msg.sender,
            tokenToWithdrawInDollars,
            availableToWithdraw
        );

        require(
            tokenToWithdrawInDollars <= availableToWithdraw,
            "Pay your debt before you can be allowed to withdraw!"
        );

        uint256 PoolTokenToRemove = getAmountInDollars(amount, tokenAddress);

        //interest for suppliers
        for (uint256 j = 0; j < tokensForLending.length; j++) {
            Token memory currentTokenForLending = tokensForLending[j];

            if (currentTokenForLending.tokenAddress == tokenAddress) {
                uint256 amountOut = amount +
                    (amount * currentTokenForLending.stableRate) /
                    1e18;
                require(
                    token.balanceOf(address(this)) >= amountOut,
                    "Not enough liquidity for withdrawal"
                );
                token.transfer(msg.sender, amountOut);
                break;
            }
        }

        tokensLentAmount[tokenAddress][msg.sender] =
            tokensLentAmount[tokenAddress][msg.sender] -
            amount;

        uint256 totalAmountLentInDollars = getTotalAmountLentInDollars(
            msg.sender
        );

        emit Withdraw(
            msg.sender,
            amount,
            tokenToWithdrawInDollars,
            availableToWithdraw,
            totalAmountLentInDollars,
            PoolTokenToRemove
        );

        if (totalAmountLentInDollars <= 0) {
            lenders[uint256(index)] = lenders[lenders.length - 1];
            lenders.pop();
        }
    }

   function interest(address tokenAddress, uint256 tokenBorrowed) public view returns (uint256) {
    Token memory token = getTokenForBorrow(tokenAddress);
    return (tokenBorrowed * token.stableRate) / 1e18;
  }

  function getTokenForBorrow(address tokenAddress) public view returns (Token memory) {
    Token memory token;
    for (uint256 i = 0; i < tokensForBorrowing.length; i++) {
      Token memory currentToken = tokensForBorrowing[i];
      if (currentToken.tokenAddress == tokenAddress) {
        token = currentToken;
        break;
      }
    }
    return token;
  }

  function getTokenForSupply(address tokenAddress) public view returns (Token memory) {
    Token memory token;
    for (uint256 i = 0; i < tokensForLending.length; i++) {
      Token memory currentToken = tokensForLending[i];
      if (currentToken.tokenAddress == tokenAddress) {
        token = currentToken;
        break;
      }
    }
    return token;
  }

  function getUserTotalInterestAccrued(address user) public view returns (uint256) {
    uint256 totalInterest = 0;

    for (uint256 i = 0; i < tokensForBorrowing.length; i++) {
      address tokenAddress = tokensForBorrowing[i].tokenAddress;
      uint256 tokenAmountBorrowed = tokensBorrowedAmount[tokenAddress][user];

      uint256 interestAccrued = interest(tokenAddress, tokenAmountBorrowed);
      totalInterest += interestAccrued;
    }

    return totalInterest;
  }

  function getUserTotalInterestEarned(address user) public view returns (uint256) {
    uint256 totalInterestEarned = 0;

    for (uint256 i = 0; i < tokensForLending.length; i++) {
      address tokenAddress = tokensForLending[i].tokenAddress;
      uint256 tokenAmountLent = tokensLentAmount[tokenAddress][user];

      uint256 interestEarned = (tokenAmountLent * tokensForLending[i].stableRate) / 1e18;
      totalInterestEarned += interestEarned;
    }

    return totalInterestEarned;
  }

  function getTokenAvailableToWithdraw(address user) public view returns (uint256) {
    uint256 totalAmountBorrowedInDollars = getTotalAmountBorrowedInDollars(user);

    uint remainingCollateral = 0;

    if (totalAmountBorrowedInDollars > 0) {
      remainingCollateral = getRemainingCollateral(user);
    } else {
      remainingCollateral = getTotalAmountLentInDollars(user);
    }

    if (remainingCollateral < totalAmountBorrowedInDollars) {
      return 0;
    }

    uint256 availableToWithdraw = remainingCollateral - totalAmountBorrowedInDollars;

    return availableToWithdraw;
  }

  function getUserTotalAmountAvailableForBorrowInDollars(address user) public view returns (uint256) {
    uint256 availableCollateral = getRemainingCollateral(user);
    uint256 totalBorrowed = getTotalAmountBorrowedInDollars(user);

    if (totalBorrowed >= availableCollateral) {
        return 0;
    }

    return availableCollateral - totalBorrowed;
}

  function getRemainingCollateral(address user) public view returns (uint256) {
    uint256 remainingCollateral = 0;
    for (uint256 i = 0; i < noOfTokensLent; i++) {
      address userLentTokenAddressFound = tokensLent[i][user];

      if (userLentTokenAddressFound != address(0)) {
        Token memory currentTokenFound = getTokenForSupply(userLentTokenAddressFound);
        uint256 tokenAmountLent = tokensLentAmount[userLentTokenAddressFound][user];

        uint256 tokenAmountLentInDollars = getAmountInDollars(
          tokenAmountLent,
          userLentTokenAddressFound
        );

        remainingCollateral += (tokenAmountLentInDollars * currentTokenFound.LTV) / 1e18;
      }
    }
    return remainingCollateral;
  }

  function indexOf(address user, address[] memory addressArray) public pure returns (int256) {
    for (uint256 i = 0; i < addressArray.length; i++) {
      if (addressArray[i] == user) {
        return int256(i);
      }
    }
    return -1;
  }

  function getUserSupplyForToken(address user, address tokenAddress) public view returns (uint256) {
    return tokensLentAmount[tokenAddress][user];
  }

  function getUserBorrowedForToken(
    address user,
    address tokenAddress
  ) public view returns (uint256) {
    return tokensBorrowedAmount[tokenAddress][user];
  }

  function getUserTotalAmountLentForTokenInDollars(
    address user,
    address tokenAddress
  ) public view returns (uint256) {
    uint256 tokenAmountLent = tokensLentAmount[tokenAddress][user];

    if (tokenAmountLent == 0) {
      return 0;
    }

    uint256 tokenAmountLentInDollars = getAmountInDollars(tokenAmountLent, tokenAddress);

    return tokenAmountLentInDollars;
  }

  function getUserTotalAmountBorrowedForTokenInDollars(
    address user,
    address tokenAddress
  ) public view returns (uint256) {
    uint256 tokenAmountBorrowed = tokensBorrowedAmount[tokenAddress][user];

    if (tokenAmountBorrowed == 0) {
      return 0;
    }

    uint256 tokenAmountBorrowedInDollars = getAmountInDollars(tokenAmountBorrowed, tokenAddress);

    return tokenAmountBorrowedInDollars;
  }

  function getTotalAmountBorrowedInDollars(address user) public view returns (uint256) {
    uint256 totalAmountBorrowed = 0;

    for (uint256 i = 0; i < noOfTokensBorrowed; i++) {
      address userBorrowedTokenAddressFound = tokensBorrowed[i][user];

      if (userBorrowedTokenAddressFound != address(0)) {
        uint256 tokenAmountBorrowed = tokensBorrowedAmount[userBorrowedTokenAddressFound][user];

        uint256 tokenAmountBorrowedInDollars = getAmountInDollars(
          tokenAmountBorrowed,
          userBorrowedTokenAddressFound
        );

        totalAmountBorrowed += tokenAmountBorrowedInDollars;
      }
    }
    return totalAmountBorrowed;
  }

  function getTotalAmountLentInDollars(address user) public view returns (uint256) {
    uint256 totalAmountLent = 0;
    for (uint256 i = 0; i < noOfTokensLent; i++) {
      address userLentTokenAddressFound = tokensLent[i][user];

      if (userLentTokenAddressFound != address(0)) {
        uint256 tokenAmountLent = tokensLentAmount[userLentTokenAddressFound][user];

        uint256 tokenAmountLentInDollars = getAmountInDollars(
          tokenAmountLent,
          userLentTokenAddressFound
        );

        totalAmountLent += tokenAmountLentInDollars;
      }
    }
    return totalAmountLent;
  }

  function getTokensSuppliedByUser(address user) public view returns (Token[] memory) {
    uint256 tokenCount = 0;

    // First, count how many tokens the user has supplied
    for (uint256 i = 0; i < tokensForLending.length; i++) {
      address tokenAddress = tokensForLending[i].tokenAddress;
      if (tokensLentAmount[tokenAddress][user] > 0) {
        tokenCount++;
      }
    }

    Token[] memory tokensSupplied = new Token[](tokenCount);
    uint256 index = 0;

    // Add tokens that the user has supplied to the array (as Token structs)
    for (uint256 i = 0; i < tokensForLending.length; i++) {
      address tokenAddress = tokensForLending[i].tokenAddress;
      if (tokensLentAmount[tokenAddress][user] > 0) {
        tokensSupplied[index] = tokensForLending[i];
        index++;
      }
    }

    return tokensSupplied;
  }

  function getTokensBorrowedByUser(address user) public view returns (Token[] memory) {
    uint256 tokenCount = 0;

    for (uint256 i = 0; i < tokensForBorrowing.length; i++) {
      address tokenAddress = tokensForBorrowing[i].tokenAddress;
      if (tokensBorrowedAmount[tokenAddress][user] > 0) {
        tokenCount++;
      }
    }

    Token[] memory BorrowedTokens = new Token[](tokenCount);
    uint256 index = 0;

    for (uint256 i = 0; i < tokensForBorrowing.length; i++) {
      address tokenAddress = tokensForBorrowing[i].tokenAddress;
      if (tokensBorrowedAmount[tokenAddress][user] > 0) {
        BorrowedTokens[index] = tokensForBorrowing[i];
        index++;
      }
    }

    return BorrowedTokens;
  }

  function tokenIsBorrowed(address user, address token) private view returns (bool) {
    return tokensBorrowedAmount[token][user] != 0;
  }

  function tokenIsAllowed(
    address tokenAddress,
    Token[] memory tokenArray
  ) private pure returns (bool) {
    if (tokenArray.length > 0) {
      for (uint256 i = 0; i < tokenArray.length; i++) {
        Token memory currentToken = tokenArray[i];
        if (currentToken.tokenAddress == tokenAddress) {
          return true;
        }
      }
    }

    return false;
  }

  function tokenIsAlreadyThere(
    Token memory token,
    Token[] memory tokenArray
  ) private pure returns (bool) {
    if (tokenArray.length > 0) {
      for (uint256 i = 0; i < tokenArray.length; i++) {
        Token memory currentToken = tokenArray[i];
        if (currentToken.tokenAddress == token.tokenAddress) {
          return true;
        }
      }
    }

    return false;
  }

  function getAmountInDollars(uint256 amount, address tokenAddress) public view returns (uint256) {
    uint256 dollarPerToken = oneTokenEqualsHowManyDollars(tokenAddress);

    uint8 tokenDecimals = IERC20Metadata(tokenAddress).decimals();

    uint256 amountIn = amount * (10 ** (18 - tokenDecimals));

    return (amountIn * dollarPerToken) / 1e18;
  }

  function oneTokenEqualsHowManyDollars(address asset) public view returns (uint256) {
    uint256 price = oracle.getAssetPrice(asset);
    return price;
  }

  function updateUserTokensBorrowedOrLent(
    address tokenAddress,
    uint256 amount,
    int256 userIndex,
    string memory lendersOrBorrowers
  ) internal {
    if (keccak256(abi.encodePacked(lendersOrBorrowers)) == keccak256(abi.encodePacked('lenders'))) {
      address currentUser = lenders[uint256(userIndex)];

      bool tokenLendedAlready = hasLentOrBorrowedToken(
        currentUser,
        tokenAddress,
        noOfTokensLent,
        'tokensLent'
      );

      if (tokenLendedAlready) {
        tokensLentAmount[tokenAddress][currentUser] =
          tokensLentAmount[tokenAddress][currentUser] +
          amount;
      } else {
        tokensLent[noOfTokensLent++][currentUser] = tokenAddress;
        tokensLentAmount[tokenAddress][currentUser] = amount;
      }
    } else if (
      keccak256(abi.encodePacked(lendersOrBorrowers)) == keccak256(abi.encodePacked('borrowers'))
    ) {
      address currentUser = borrowers[uint256(userIndex)];

      bool tokenBorrowedAlready = hasLentOrBorrowedToken(
        currentUser,
        tokenAddress,
        noOfTokensBorrowed,
        'tokensBorrowed'
      );

      if (tokenBorrowedAlready) {
        tokensBorrowedAmount[tokenAddress][currentUser] =
          tokensBorrowedAmount[tokenAddress][currentUser] +
          amount;
      } else {
        tokensBorrowed[noOfTokensBorrowed++][currentUser] = tokenAddress;
        tokensBorrowedAmount[tokenAddress][currentUser] = amount;
      }
    }
  }

  function hasLentOrBorrowedToken(
    address currentUser,
    address tokenAddress,
    uint256 noOfTokenslentOrBorrowed,
    string memory _tokensLentOrBorrowed
  ) public view returns (bool) {
    if (noOfTokenslentOrBorrowed > 0) {
      if (
        keccak256(abi.encodePacked(_tokensLentOrBorrowed)) ==
        keccak256(abi.encodePacked('tokensLent'))
      ) {
        for (uint256 i = 0; i < noOfTokensLent; i++) {
          address tokenAddressFound = tokensLent[i][currentUser];
          if (tokenAddressFound == tokenAddress) {
            return true;
          }
        }
      } else if (
        keccak256(abi.encodePacked(_tokensLentOrBorrowed)) ==
        keccak256(abi.encodePacked('tokensBorrowed'))
      ) {
        for (uint256 i = 0; i < noOfTokensBorrowed; i++) {
          address tokenAddressFound = tokensBorrowed[i][currentUser];
          if (tokenAddressFound == tokenAddress) {
            return true;
          }
        }
      }
    }

    return false;
  }

  function isUserPresentIn(
    address userAddress,
    address[] memory users
  ) private pure returns (bool, int256) {
    if (users.length > 0) {
      for (uint256 i = 0; i < users.length; i++) {
        address currentUserAddress = users[i];
        if (currentUserAddress == userAddress) {
          return (true, int256(i));
        }
      }
    }

    return (false, -1);
  }

   function getTotalTokenSupplied(address tokenAddress) public view returns (uint256) {
    uint256 totalTokenSupplied = 0;
    if (lenders.length > 0) {
      for (uint256 i = 0; i < lenders.length; i++) {
        address curentLender = lenders[i];
        totalTokenSupplied += tokensLentAmount[tokenAddress][curentLender];
      }
    }

    return (totalTokenSupplied / 10 ** IERC20Metadata(tokenAddress).decimals());
  }

  function getTotalTokenBorrowed(address tokenAddress) public view returns (uint256) {
    uint256 totalTokenBorrowed = 0;
    if (borrowers.length > 0) {
      for (uint256 i = 0; i < borrowers.length; i++) {
        address curentBorrower = borrowers[i];
        totalTokenBorrowed += tokensBorrowedAmount[tokenAddress][curentBorrower];
      }
    }
    return (totalTokenBorrowed / 10 ** IERC20Metadata(tokenAddress).decimals());
  }

  function getTotalTokensSupplied() public view returns (address[] memory, uint256[] memory) {
    uint256 tokenCount = tokensForLending.length;
    address[] memory tokenAddresses = new address[](tokenCount);
    uint256[] memory totalAmountsSupplied = new uint256[](tokenCount);

    for (uint256 i = 0; i < tokenCount; i++) {
        address tokenAddress = tokensForLending[i].tokenAddress;
        uint256 totalTokenSupplied = 0;

        for (uint256 j = 0; j < lenders.length; j++) {
            address currentLender = lenders[j];
            totalTokenSupplied += tokensLentAmount[tokenAddress][currentLender];
        }

        tokenAddresses[i] = tokenAddress;
        totalAmountsSupplied[i] = totalTokenSupplied / 10 ** IERC20Metadata(tokenAddress).decimals(); 
    }

    return (tokenAddresses, totalAmountsSupplied);
}


 function getTotalTokensBorrowed() public view returns (address[] memory, uint256[] memory) {
    uint256 tokenCount = tokensForBorrowing.length;
    address[] memory tokenAddresses = new address[](tokenCount);
    uint256[] memory totalAmountsBorrowed = new uint256[](tokenCount);

    for (uint256 i = 0; i < tokenCount; i++) {
        address tokenAddress = tokensForBorrowing[i].tokenAddress;
        uint256 totalTokenBorrowed = 0;

        for (uint256 j = 0; j < borrowers.length; j++) {
            address currentBorrower = borrowers[j];
            totalTokenBorrowed += tokensBorrowedAmount[tokenAddress][currentBorrower];
        }

        tokenAddresses[i] = tokenAddress;
        totalAmountsBorrowed[i] = totalTokenBorrowed / 10 ** IERC20Metadata(tokenAddress).decimals(); 
    }

    return (tokenAddresses, totalAmountsBorrowed);
}


  function getTotalSupplyInDollars() public view returns (uint256) {
    uint256 totalSupplyInDollars = 0;

    for (uint256 i = 0; i < tokensForLending.length; i++) {
      address tokenAddress = tokensForLending[i].tokenAddress;
      uint256 tokenTotalSupply = 0;

      for (uint256 j = 0; j < lenders.length; j++) {
        address lender = lenders[j];
        tokenTotalSupply += tokensLentAmount[tokenAddress][lender];
      }

      uint256 tokenTotalSupplyInDollars = getAmountInDollars(tokenTotalSupply, tokenAddress);
      totalSupplyInDollars += tokenTotalSupplyInDollars;
    }

    return totalSupplyInDollars;
  }

  function getTotalBorrowedInDollars() public view returns (uint256) {
    uint256 totalBorrowedInDollars = 0;

    for (uint256 i = 0; i < tokensForBorrowing.length; i++) {
      address tokenAddress = tokensForBorrowing[i].tokenAddress;
      uint256 tokenTotalBorrowed = 0;

      for (uint256 j = 0; j < borrowers.length; j++) {
        address borrower = borrowers[j];
        tokenTotalBorrowed += tokensBorrowedAmount[tokenAddress][borrower];
      }

      uint256 tokenTotalBorrowedInDollars = getAmountInDollars(tokenTotalBorrowed, tokenAddress);
      totalBorrowedInDollars += tokenTotalBorrowedInDollars;
    }

    return totalBorrowedInDollars;
  }

  function getLendersArray() public view returns (address[] memory) {
    return lenders;
  }

  function getBorrowersArray() public view returns (address[] memory) {
    return borrowers;
  }

  function getTokensForLendingArray() public view returns (Token[] memory) {
    return tokensForLending;
  }

  function getTokensForBorrowingArray() public view returns (Token[] memory) {
    return tokensForBorrowing;
  }
  
}
