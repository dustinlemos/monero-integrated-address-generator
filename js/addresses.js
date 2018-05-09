//This file was created using code from luigi1111's address tools
//located at https://xmr.llcoins.net/
//see copyright below

//functions for various XMR/Cryptonote stuff
//(c) 2016 luigi1111
//can't imagine this is useful for anything but this site, but
//Licensed under the MIT license:
//http://www.opensource.org/licenses/MIT

//requires cn_util.js, mnemonic.js, sha3.js, and their requirements

generateIntegratedAddress = function (walletAddress) {
	var addr58 = walletAddress;
	var pubSpend2 = {};
	var pubView2 = {};
	var pubAddrHex = {};
	var pubAddrChksum = {};
	var pubAddrForHash = {};
	var pubAddrHash = {};
	var pubAddrChksum2 = {};
	var xmrAddr = {};

  if (addr58.length !== 95 && addr58.length !== 97 && addr58.length !== 51 && addr58.length !== 106){
    throw "Invalid Address Length!";
  }
  //Get the netbyte
  var addrHex = cnBase58.decode(addr58);
  if (addrHex.length === 140){
    var netbyte = addrHex.slice(0,4);
  } else {
    var netbyte = addrHex.slice(0,2);
  }
  //viewkey + pID stuff
  if (netbyte === "13"){
    throw "Invalid Address (netbyte 13): you must use a standard XMR address (netbyte 12)";
  }
  if (netbyte === "11"){
    throw "Invalid Address (netbyte 11): please use a standard XMR address (netbyte 12)";
  } else if (addrHex.length === 140){
    pubView2.value = addrHex.slice(68,132);
  } else {
    pubView2.value = addrHex.slice(66,130);
  }
  if ((netbyte !== "11" && netbyte !== "13") && addrHex.length !== 138 && addrHex.length !== 140){
    throw "Invalid Address Length!";
  }
  var addrHash = cn_fast_hash(addrHex.slice(0,-8));
  pubAddrHex.value = addrHex;
  if (addrHex.length === 140){
    pubSpend2.value = addrHex.slice(4,68);
  } else {
    pubSpend2.value = addrHex.slice(2,66);
  }
  pubAddrChksum.value = addrHex.slice(-8);
  pubAddrForHash.value = addrHex.slice(0,-8);
  pubAddrHash.value = addrHash;
  pubAddrChksum2.value = addrHash.slice(0,8);

  if (addrHex.slice(-8) != addrHash.slice(0,8)) {
    throw "checksum invalid!"
  }
  // *** Generate random payment ID
  var pID = rand_32().slice(0,16);
  xmrAddr.value = toPublicAddr("13", pubSpend2.value, pubView2.value, pID);
  return {
    // "publicViewKey": pubView2.value,
    // "publicSpendKey": pubSpend2.value,
    "integratedAddress": xmrAddr.value,
    "paymentId": pID
  }
};

function toPublicAddr(netbyte, pubsk, pubvk, pid){
  if (pubvk === undefined){pubk = "";}
  if (pid === undefined){pid = "";}
  if ((netbyte !== "13" && pid !== "") || (netbyte === "13" && pid === "")){throw "pid or no pid with wrong address type";}
  if (netbyte === "11"){pubvk = "";}
  var preAddr = netbyte + pubsk + pubvk + pid;
  var hash = cn_fast_hash(preAddr);
  var addrHex = preAddr + hash.slice(0,8);
  return cnBase58.encode(addrHex);
}
