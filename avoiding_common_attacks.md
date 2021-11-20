# Contract security measures

## SWC-103 (Floating pragma)

Specific compiler pragma `0.8.9` used to ensure that contract do not accidentally get deployed using, for example, an outdated compiler version that might introduce bugs that affect the contract system negatively.

## SWC-115 (Authorization through tx.origin)
`tx.origin` not used for authorization within `onlyOwner` and `onlyLuckyDrawOwner`. Instead, `msg.sender`.

## Use Modifiers Only for Validation 
Modifiers used in contract are only for validation using `require` and have no external calls.
