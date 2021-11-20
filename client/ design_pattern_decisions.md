# Design patterns used

## Inheritance and Interfaces

- `LuckyDrawController` contract inherits 
  - OpenZeppelin `Ownable` contract to enable ownership for pausing/unpausing the contract.
  - OpenZeppelin `Pausable` contract in order to pause/unpause the contract

## Access Control Design Patterns

- `Ownable` design pattern used to enable ownership for pausing/unpausing the contract
- `Ownable` design pattern used to enable ownership so that only creator of lucky draw can modify the lucky draw.

