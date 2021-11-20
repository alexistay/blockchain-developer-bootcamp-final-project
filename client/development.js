const developmentAddress = "0xCc22fbf05b0C5CE7f6BfB7BbcD6aFEeA1F61dc06";
const developmentABI = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"luckyDrawId","type":"uint256"},{"components":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"bytes32","name":"entries","type":"bytes32"},{"internalType":"string","name":"entriesIPFScid","type":"string"},{"internalType":"uint256","name":"numEntries","type":"uint256"},{"internalType":"string","name":"salt","type":"string"},{"internalType":"uint256[]","name":"winners","type":"uint256[]"},{"internalType":"enum LuckyDrawController.LuckyDrawState","name":"luckyDrawState","type":"uint8"}],"indexed":false,"internalType":"struct LuckyDrawController.LuckyDraw","name":"luckyDraw","type":"tuple"}],"name":"LuckyDrawCreated","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"bytes32","name":"entries","type":"bytes32"},{"internalType":"string","name":"entriesIPFScid","type":"string"},{"internalType":"uint256","name":"numEntries","type":"uint256"},{"internalType":"string","name":"salt","type":"string"},{"internalType":"uint256[]","name":"winners","type":"uint256[]"},{"internalType":"enum LuckyDrawController.LuckyDrawState","name":"luckyDrawState","type":"uint8"}],"indexed":false,"internalType":"struct LuckyDrawController.LuckyDraw","name":"luckyDraw","type":"tuple"}],"name":"LuckyDrawEntriesSet","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"bytes32","name":"entries","type":"bytes32"},{"internalType":"string","name":"entriesIPFScid","type":"string"},{"internalType":"uint256","name":"numEntries","type":"uint256"},{"internalType":"string","name":"salt","type":"string"},{"internalType":"uint256[]","name":"winners","type":"uint256[]"},{"internalType":"enum LuckyDrawController.LuckyDrawState","name":"luckyDrawState","type":"uint8"}],"indexed":false,"internalType":"struct LuckyDrawController.LuckyDraw","name":"luckyDraw","type":"tuple"}],"name":"LuckyDrawSaltSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bool","name":"paused","type":"bool"}],"name":"LuckyDrawStateChange","type":"event"},{"anonymous":false,"inputs":[{"components":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"bytes32","name":"entries","type":"bytes32"},{"internalType":"string","name":"entriesIPFScid","type":"string"},{"internalType":"uint256","name":"numEntries","type":"uint256"},{"internalType":"string","name":"salt","type":"string"},{"internalType":"uint256[]","name":"winners","type":"uint256[]"},{"internalType":"enum LuckyDrawController.LuckyDrawState","name":"luckyDrawState","type":"uint8"}],"indexed":false,"internalType":"struct LuckyDrawController.LuckyDraw","name":"luckyDraw","type":"tuple"}],"name":"LuckyDrawWinnerPicked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"luckyDraws","outputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"bytes32","name":"entries","type":"bytes32"},{"internalType":"string","name":"entriesIPFScid","type":"string"},{"internalType":"uint256","name":"numEntries","type":"uint256"},{"internalType":"string","name":"salt","type":"string"},{"internalType":"enum LuckyDrawController.LuckyDrawState","name":"luckyDrawState","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"}],"name":"createLuckyDraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_luckyDrawId","type":"uint256"},{"internalType":"bytes32","name":"_entries","type":"bytes32"},{"internalType":"string","name":"_entriesIPFScid","type":"string"},{"internalType":"uint256","name":"_numEntries","type":"uint256"}],"name":"setEntries","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_luckyDrawId","type":"uint256"}],"name":"pickWinner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_luckyDrawId","type":"uint256"},{"internalType":"string","name":"_salt","type":"string"}],"name":"setSalt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getNumluckyDraws","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLuckyDrawIds","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_luckyDrawId","type":"uint256"}],"name":"getLuckyDraw","outputs":[{"components":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"bytes32","name":"entries","type":"bytes32"},{"internalType":"string","name":"entriesIPFScid","type":"string"},{"internalType":"uint256","name":"numEntries","type":"uint256"},{"internalType":"string","name":"salt","type":"string"},{"internalType":"uint256[]","name":"winners","type":"uint256[]"},{"internalType":"enum LuckyDrawController.LuckyDrawState","name":"luckyDrawState","type":"uint8"}],"internalType":"struct LuckyDrawController.LuckyDraw","name":"luckyDraw","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_luckyDrawId","type":"uint256"}],"name":"getEntries","outputs":[{"internalType":"bytes32","name":"entries","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_luckyDrawId","type":"uint256"}],"name":"getWinners","outputs":[{"internalType":"uint256[]","name":"winners","type":"uint256[]"}],"stateMutability":"view","type":"function"}];
