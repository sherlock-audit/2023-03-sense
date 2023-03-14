
# Sense Finance Periphery & Roller Periphery contest details

- Join [Sherlock Discord](https://discord.gg/MABEWyASkp)
- Submit findings using the issue page in your private contest repo (label issues as med or high)
- [Read for more details](https://docs.sherlock.xyz/audits/watsons)

# Resources

- [Periphery Docmentation](https://docs.sense.finance/docs/smart-contracts/#core)
- [Auto Roller Launch Announcement](https://medium.com/sensefinance/auto-rolling-liquidity-coming-to-sense-c5b1ff0f9aeb)

# On-chain context

```
DEPLOYMENT: mainnet, Arbitrum, Optimism
ERC20: any (USDC, DAI, USDT, ETH, stETH, etc)
ERC721: none
ERC777: none
FEE-ON-TRANSFER: none
REBASING TOKENS: any
ADMIN: trusted
EXTERNAL-ADMINS: restricted
```


### Q: Are there any additional protocol roles? If yes, please explain in detail:
A: 

There are trusted actors that can update contract addresses on the `Periphery` and `Divider` contracts, verify adapters in the `Periphery`, and backfill scales in the `Divider`. These roles are restricted to a small number of trusted actors.

___
### Q: Is the code/contract expected to comply with any EIPs? Are there specific assumptions around adhering to those EIPs that Watsons should be aware of?
A: 

No, however the `AutoRoller` that the `RollerPeriphery` interacts with is expected to conform to the ERC4626 standard.

___

### Q: Please list any known issues/acceptable risks that should not result in a valid finding.
A: 

- `eject` is called on the AutoRoller even though it isn't a 4626 function. This code path in the `RollerPeriphy` has been unchanged since the last audit and so doesn't require additional review.
- the `Divider` is unchanged from previous audits and doesn't require deep review other than what's needed to audit the `Periphery`
- the `BaseAdapter` is largely unchanged from previous audits and doesn't require deep review other than what's needed to audit the `Periphery`

____
### Q: Please provide links to previous audits (if any).
A:

- RollerPeriphery.sol
    - [Sherlock Nov 2022](https://github.com/sense-finance/auto-roller/blob/main/audits/2022.12.6_-_Final_-_Sense_Audit_Report.pdf)
- Periphery.sol, Divider.sol, BaseAdapter.sol, Trust.sol
    - [Spearbit Feb 2022](https://github.com/sense-finance/sense-v1/blob/dev/audits/spearbit/2022-01-21.pdf)
    - [FPS March 2022](https://github.com/sense-finance/sense-v1/blob/dev/audits/fps/2022-03-15.pdf)

___

### Q: Are there any off-chain mechanisms or off-chain procedures for the protocol (keeper bots, input validation expectations, etc)? 
A: 

We expect that the user gets swap quotes from the [0x API](https://docs.0x.org/0x-swap-api/guides/swap-tokens-with-0x-api) and pass them into the relevant function calls.


_____

### Q: In case of external protocol integrations, are the risks of an external protocol pausing or executing an emergency withdrawal acceptable? If not, Watsons will submit issues related to these situations that can harm your protocol's functionality. 
A:

Acceptable


# Audit scope


[sense-v1 @ 82abac25404d83b7aefaaeb46631f1d050dc4a4e](https://github.com/sense-finance/sense-v1/tree/82abac25404d83b7aefaaeb46631f1d050dc4a4e)
- [sense-v1/pkg/core/src/Divider.sol](sense-v1/pkg/core/src/Divider.sol)
- [sense-v1/pkg/core/src/Periphery.sol](sense-v1/pkg/core/src/Periphery.sol)
- [sense-v1/pkg/core/src/adapters/abstract/BaseAdapter.sol](sense-v1/pkg/core/src/adapters/abstract/BaseAdapter.sol)
- [sense-v1/pkg/utils/src/Trust.sol](sense-v1/pkg/utils/src/Trust.sol)

[auto-roller @ 60b8b4d56346f053becafb6a9f50f75cebafcafa](https://github.com/sense-finance/auto-roller/tree/60b8b4d56346f053becafb6a9f50f75cebafcafa)
- [auto-roller/src/RollerPeriphery.sol](auto-roller/src/RollerPeriphery.sol)


# Testing

We use [foundry: forge](https://github.com/foundry-rs/foundry) as our development framework. Ensure you have the latest version installed before running the tests.

## Sense v1 Core

### Environment

1. Create a local `.env` file in the root directory of the project
2. Set `RPC_URL_MAINNET` to a valid RPC URL

### Test

```bash
# Iniatialize submodules
git submodule update --init --recursive

# CD into the core contract directory
cd sense-v1/pkg/core
yarn install # or npm install

# Run basic tests suite against a local chain. This is all tests ending in .t.sol
# All tests run with underlying, target and stake aas ERC20 compliant tokens wth 18 decimals
yarn test

# Run mainnet tests (against a mainnet fork). This is all tests endng in .tm.sol
# All tests run with underlying, target and stake aas ERC20 compliant tokens wth 18 decimals
# (unless they use existing tokens)
yarn test:mainnet
```


## Roller

### Environment

1. Create a local `.env` file in the root directory of the project
2. Set `RPC_URL_MAINNET` to a valid RPC URL

### Test

```bash
# Iniatialize submodules
git submodule update --init --recursive

# CD into the auto roller directory
cd auto-roller

# Initialize sense-v1 deps
cd lib/sense-v1
yarn install # or npm install
cd ../..

# Run basic tests suite against a local chain. This is all tests ending in .t.sol
forge test --match-path "*.t.sol"

# Run mainnet tests (against a mainnet fork). This is all tests ending in .tm.sol
forge test --match-path "*.tm.sol"
```


# About Sense Finance

For DeFi users looking to employ their yield-bearing assets or hedge/trade against future yields, Sense is a decentralized protocol that provides access to interest rate management. Unlike other fixed-income protocols, Sense provides a secure and scalable design that lacks liquidation risk and interfaces with a wide selection of yield sources. 