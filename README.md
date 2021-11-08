## Lucky Draw Winner Picker
This project was inspired due to the controversies in 2019 when Justin Sun promised to give away a Tesla to one lucky Twitter follower. There were reportedly 88 draws done, and even though a video was released of the draw process, it was later claimed that there was a gitch in the selection process and the draw was conducted again. The second winner somehow also appeared in a frame in the original video. https://twitter.com/Tronics4L/status/1111322264828628992

The main idea is to use the blockchain such that
* the draw can only be conducted once
* random winner is selected by the blockchain
* users can ascertain that they are in the list of entries
* users cannot get the entire list of entries
* users can get the number of entries

## Work Flow
1. Contest operator visits webpage and signs up for a draw and gets a draw ID.
2. Operator publishes draw ID. This draw ID is used so that there can only be 1 draw done.
3. Operator allows people to enter the draw and gets a list of entries. This is not part of the scope of the project.
4. Operator submits list of entries to website.
5. Webpage choose a random winner from entries via the blockchain

