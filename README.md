# New bot deployment detector

## Description

This bot detects new bots deployed from the Nethermind teams forta-deployer address

## Supported Chains

- Polygon

## Alerts

- NETH-1
  - Fired when a transaction from the Forta deployer address creates a new bot.
  - Severity is always set to "info"
  - Type is always set to "info"
  - Metadata:
    - agentId: unique id of the bot
    - metadata: metadata of the bot
    - chainId: chains supported by the bot

## Test Data

The bot behaviour can be verified with the following transactions:

- (create bot function)
  - tx: 0xb9fffc84511a7135aeed7db1f560951dac6c9ea49c8de353e9c41d70a322b210

# -intern-challenges-one
