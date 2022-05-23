import Caver from "caver-js";
import * as Setting from "./settings.js";
export {agContract, Session};


const config = {
  rpcURL : 'wss://api.baobab.klaytn.net:8652'
}
const ws = new Caver.providers.WebsocketProvider(config.rpcURL, { reconnect: { auto: true } });
const cav = new Caver(ws);
const agContract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);



const Session = {
  auth: {
    accessType: 'keystore',
    keystore: '',
    password: '',
    wallet_address: '',
  },
  init: async function () {
    const walletFromSession = sessionStorage.getItem('walletInstance');
    if (walletFromSession) {
      try {
        cav.klay.accounts.wallet.add(JSON.parse(walletFromSession));
        const wallet = this.getWallet();
        wallet.address = cav.utils.toChecksumAddress(wallet.address);
        this.auth.wallet_address = wallet.address;
      } catch(e) {
        sessionStorage.removeItem('walletInstance');
      }
    }else{
      if (Setting.DEBUG){ // 자동 로그인
        this.auth.accessType = 'privateKey';
        this.handleLogin();
      }
    }
  },

  handleImport: async function (event) {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0]);
    fileReader.onload = (event) => {
      try{
        if (!this.checkValidKeystore(event.target.result)){
          // ui에 표시하는 방식으로 바꾸기
          alert('유효하지 않은 keystore 파일입니다.');
          return;
        }
        this.auth.keystore = event.target.result;
        // ui에 표시하는 방식으로 바꾸기
        alert('keystore 통과. 비밀번호를 입력하세요.');
      } catch(event){
        alert('유효하지 않은 keystore 파일입니다.');
        return;
      }
    }
  },

  handleLogin: async function () {
    if (this.auth.accessType === 'keystore') {
      try {
        const privateKey = cav.klay.accounts.decrypt(this.auth.keystore, this.auth.password).privateKey;
        this.integrateWallet(privateKey);
      } catch (event){
        console.log(event);
        alert('비밀번호가 일치하지 않습니다.');
      }
    }else if (this.auth.accessType == 'privateKey'){
      try{
        console.log(Setting.PRIVATE_KEY);
        this.integrateWallet(Setting.PRIVATE_KEY);
        alert('LOGIN');
      } catch (event) {
        console.log(event);
        alert('잘못된 PRIVATE_KEY 입니다.');
      }
    }
    
  },

  handleLogout: async function () {
    this.removeWallet();
    location.reload();
  },

  integrateWallet: function (privateKey) {
    const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);
    walletInstance.address = caver.utils.toChecksumAddress(walletInstance.address);
    
    cav.klay.accounts.wallet.add(walletInstance);
    // 브라우저가 닫히기전까지 session에 저장.
    sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance));
    this.auth.wallet_address = walletInstance.address;
  },
  getWallet: function () {
    if (cav.klay.accounts.wallet.length) {
      return cav.klay.accounts.wallet[0];
    }
  },

  reset: function () {
    this.auth = {
      keystore: '',
      password: ''
    };
  },

  removeWallet: function () {
    cav.klay.accounts.wallet.clear();
    sessionStorage.removeItem("walletInstance");
    this.reset();
  },

};


// settings, callback

window.Session = Session;

window.addEventListener("load", function () {
  Session.init();
});

var opts = {
  lines: 10, // The number of lines to draw
  length: 30, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  color: '#5bc0de', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  position: 'absolute' // Element positioning
};