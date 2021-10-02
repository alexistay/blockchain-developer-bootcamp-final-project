# Ethereum Price NFT

## Concept
Most NFTs have value because they are supposedly scarce. However, most of this scarcity is artifically induced. For example, there are only 10,000 CryptoPunks, but there is nothing special about 10,000. The limit could have easily been set at 20,000, 50,000 or even 100,000.

I propose a NFT where there can only be 1 NFT per Ethereum price, and that NFT can only be minted when Ethereum is at that price. i.e. Say the current Eth price is $3000.23. If #3000 NFT has not been minted, then the user is allowed to mint the #3000 NFT. If #3000 NFT has already been minted, then it can no longer be minted again.

This produces real scarcity, as there can only be a certain number of this NFT, depending on the price of Ethereum. It would also be interesting to see how will the NFTs be valued. Will smaller number NFTs be more valuable than larger number NFTs because they were minted further in the past? Or will larger number NFTs be more valuable because the value of the eth (in USD) used to mint them is more than smaller number NFTs.


## Work Flow
1. User visits the webpage.
2. Webpage shows the current Ethereum price.
3. If an NFT for that price has not been minted before, the user is allowed to mint the NFT for that price.
4. Webpage also shows the current price, and a list of prices above and below the current price. For each price, it shows whether the NFT for that price has already been minted.


# Another possible idea is a lucky draw generator

## Concept
There exists websites where you can enter a list of options, and the website will choose a winner for you. My idea is to convert it to use the blockchain so that it is provable fair.

## Work Flow
1. User visits webpage and signs up for a draw and gets a draw ID
2. User publishes draw ID, and let's people sign up for the draw.
3. When the draw closes, user submits list of contestants to the webpage. List is "published" (maybe via Merkel tree?) on the webpage.
4. Webpage choose a random winner from using blockchain as source of randomness.

* Draw ID published at the start of the contest ensures that organiser cannot cheat by having multiple draws.
* List of entries are published before the winner is choosen so that contestants can prove that they are in the list of possible winners.
* Random number is sourced from blockchain so organiser cannot control which number will be choosen.
