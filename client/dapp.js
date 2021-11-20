
async function uploadIpfs(data) {
  if (typeof ipfs === 'undefined') {
    ipfs = await Ipfs.create()
  }
  const results = await ipfs.add(data)
  return results.path
}

async function downloadIpfs(cid) {
  if (typeof ipfs === 'undefined') {
    ipfs = await Ipfs.create()
  }
  const stream = ipfs.cat(cid)
  let data = ''

  for await (const chunk of stream) {
    data += chunk.toString()
  }
  return data;
}

if(typeof window.ethereum !== 'undefined') {
  let mmDetected = document.getElementById('mm-detected');
  mmDetected.innerHTML = 'MetaMask detected';
} else {
  alert('Please install MetaMask first!');
}


const mmConnect = document.getElementById('mm-connect');
mmConnect.onclick = async () => {
  console.log("mmConnect clicked");
  await ethereum.request({method: 'eth_requestAccounts' });
  document.getElementById('mm-current-account').innerHTML = "Connected to: " + ethereum.selectedAddress + " on chainId " + ethereum.chainId;        

  
  if (ethereum.chainId == 0x3) {
    abi = ropstenABI;
    address = ropstenAddress;
  } else {
    abi = developmentABI;
    address = developmentAddress;
  }
  web3 = new Web3(window.ethereum)
  ldc = new web3.eth.Contract(abi, address)
  ldc.setProvider(window.ethereum)
}

const textName = document.getElementById('name');
const btnCreateLuckyDraw = document.getElementById('createLuckyDraw');

const btnGetLuckyDrawIds = document.getElementById('getLuckyDrawIds');
const optLuckyDrawIds = document.getElementById('luckyDrawIds');
const btnClearLuckDraw = document.getElementById('clearLuckyDraw');
const btnLoadLuckyDraw = document.getElementById('loadLuckyDraw');
const textNameManage = document.getElementById('nameManage');
const textState = document.getElementById('state');
const textSalt = document.getElementById('salt');
const textEntries = document.getElementById('entries');
const btnHashEntries = document.getElementById('hashEntries');
const textHashedEntries = document.getElementById('hashedEntries');
const textHash = document.getElementById('hash');
const textNumEntries = document.getElementById('numEntries');
const textEntryUrl = document.getElementById('entryUrl');
const btnSetEntries = document.getElementById('setEntries');
const btnPickWinner = document.getElementById('pickWinner');
const textWinners = document.getElementById('winners');
const btnSubmitSalt = document.getElementById('setSalt');
const btnVerifyEntries = document.getElementById('verifyEntries');
const btnVerifyEntryWithin = document.getElementById('verifyEntryWithin');

const textControllerState = document.getElementById('controllerState');
const btnGetControllerState = document.getElementById('getControllerState');
const btnToggleControllerState = document.getElementById('toggleControllerState');

btnCreateLuckyDraw.onclick = async function() {
  console.log("createLuckyDraw clicked");
  console.log(ethereum.selectedAddress);

  receipt = await ldc.methods.createLuckyDraw(textName.value).send({from: ethereum.selectedAddress})
  luckyDraw = receipt.events.LuckyDrawCreated.returnValues.luckyDraw;
  luckyDrawId = receipt.events.LuckyDrawCreated.returnValues.luckyDrawId;
  console.log(luckyDraw);
  
  optLuckyDrawIds.length = 1;
  optLuckyDrawIds.options[0] = new Option(luckyDrawId, luckyDrawId);
  textHashedEntries.value = "";
  textEntries.value = "";
  setLuckyDraw(luckyDraw);
};

function clearLuckyDraw() {
  textNameManage.value = "";
  textSalt.value = "";
  textEntryUrl.value = "";
  textState.value = "";
  textNumEntries.value = "";
  textHash.value = "";
  textHashedEntries.value = "";
  textEntries.value = "";
  textWinners.value = "";
}

btnClearLuckDraw.onclick = clearLuckyDraw;

btnGetLuckyDrawIds.onclick = async function() {
  console.log("getLuckyDrawIds clicked");

  numLuckyDraws = await ldc.methods.getNumluckyDraws().call({from: ethereum.selectedAddress})
  optLuckyDrawIds.length = 0;
  for (i=0; i<numLuckyDraws; i++) {
    optLuckyDrawIds.add(new Option(i, i), undefined);
  }
  clearLuckyDraw();
 
};

function setLuckyDraw(luckyDraw) {
  textNameManage.value = luckyDraw.name;
  if (luckyDraw.salt !=  "") {
    textSalt.value = luckyDraw.salt;
  }
  textEntryUrl.value = luckyDraw.entriesURL;
  if (luckyDraw.luckyDrawState == 0) {
    textState.value = "Lucky Draw Created";
  } else if (luckyDraw.luckyDrawState == 1) {
    textState.value = "Entries Set";
  } else if (luckyDraw.luckyDrawState == 2) {
    textState.value = "Winner Picked";
  } else {
    textState.value = "Salt set";
  }
  textNumEntries.value = luckyDraw.numEntries;
  textHash.value = luckyDraw[2];

  textWinners.value = luckyDraw[6].join("\n");
}

btnLoadLuckyDraw.onclick = async function() {
  console.log("loadLuckyDraw clicked");
  luckyDraw = await ldc.methods.getLuckyDraw(optLuckyDrawIds.value).call({from: ethereum.selectedAddress})
  console.log(luckyDraw);

  setLuckyDraw(luckyDraw);
};

btnHashEntries.onclick = async function() {
  console.log("Hash Entries clicked")
  entries = textEntries.value;
  salt = textSalt.value;
  entries = entries.split("\n");
  textNumEntries.value = entries.length;
  console.log(entries);
  hashed = ""
  entries.forEach(function (entry) {
    if (hashed != "") {
      hashed += "\n"
    }
    console.log(`${salt}|${entry}`)
    hashed += web3.utils.sha3(`${salt}|${entry}`);
    
  });  
  textHashedEntries.value = hashed;
  textHash.value = web3.utils.sha3(hashed);

  // copyTextToClipboard(textHashedEntries.value);
  cid = await uploadIpfs(textHashedEntries.value);
  textEntryUrl.value = cid; 
  //textEntryUrl.value = `https://ipfs.io/ipfs/${cid}`; 
  // textEntryUrl.value = `${window.location.origin}/client/${optLuckyDrawIds.value}.hash`
}

btnSetEntries.onclick = async function() {
  console.log("Set Entries clicked")
  luckyDrawId = optLuckyDrawIds.value;
  entries = textHash.value;
  entryUrl = textEntryUrl.value;
  numEntries = textNumEntries.value;
  console.log("luckyDrawId: " + luckyDrawId);
  console.log("entries: " + entries);
  console.log("entryUrl: " + entryUrl);
  console.log("numEntries: " + numEntries);


  receipt = await ldc.methods.setEntries(luckyDrawId, entries, entryUrl, numEntries).send({from: ethereum.selectedAddress})
  luckyDraw = receipt.events.LuckyDrawEntriesSet.returnValues.luckyDraw
  console.log(luckyDraw)
  setLuckyDraw(luckyDraw);

}

btnPickWinner.onclick = async function() {
  console.log("Pick Winner clicked")
  let luckyDrawId = optLuckyDrawIds.value;
  console.log("luckyDrawId: " + luckyDrawId);

  receipt = await ldc.methods.pickWinner(luckyDrawId).send({from: ethereum.selectedAddress})
  console.log(receipt);
  btnLoadLuckyDraw.click();
}

btnSubmitSalt.onclick = async function() {
  console.log("Submit Salt clicked")
  luckyDrawId = optLuckyDrawIds.value;
  salt = textSalt.value;
  receipt = await ldc.methods.setSalt(luckyDrawId, salt).send({from: ethereum.selectedAddress})
  luckyDraw = receipt.events.LuckyDrawSaltSet.returnValues.luckyDraw
  console.log(luckyDraw);
  setLuckyDraw(luckyDraw);
}

btnVerifyEntries.onclick = async function() {
  console.log("Verify Entries clicked")
  console.log(textEntryUrl.value);
  // result = await fetch(textEntryUrl.value)
  // text = await result.text();
  text = await downloadIpfs(textEntryUrl.value);
  text = text.trim();
  textHashedEntries.value = text;
  console.log(text);
  hashed = web3.utils.sha3(text);
  if(hashed == textHash.value) {
    window.alert("Entries are valid");
  } else {
    window.alert("Warning: Entries are invalid!");
  }
}

btnVerifyEntryWithin.onclick = function() {
  console.log("Verify Entry Within Lucky Draw clicked")
  entry = prompt("Enter entry to verify:");
  salt = textSalt.value;
  console.log(`${salt}|${entry}`)
  hashed = web3.utils.sha3(`${salt}|${entry}`);
  hashes = textHashedEntries.value.split("\n");
  console.log(hashed);
  for (i = 0; i < hashes.length; i++) {
    if (hashed == hashes[i]) {
      window.alert(`${entry} found at location ${i}`);
      return
    }
  }
  window.alert(`Warning! ${entry} not found`);
}

function updateControllerState(paused) {
  if (paused) {
    textControllerState.value = "Paused";
  } else {
    textControllerState.value = "Active";
  }
}

btnGetControllerState.onclick = async function() {
  console.log("Get Controller State clicked")
  paused = await ldc.methods.paused().call({from: ethereum.selectedAddress})
  console.log(paused);
  updateControllerState(paused);
}

btnToggleControllerState.onclick = async function() {
  console.log("Toggle Controller State clicked")
  state = await ldc.methods.paused().call({from: ethereum.selectedAddress})
  console.log(state);
  if (state == true) {
    receipt = await ldc.methods.unpause().send({from: ethereum.selectedAddress})
  } else {
    receipt = await ldc.methods.pause().send({from: ethereum.selectedAddress})
  }
  console.log(receipt);
  paused = receipt.events.LuckyDrawStateChange.returnValues.paused
  updateControllerState(paused);
}