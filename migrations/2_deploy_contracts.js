const fs = require('fs');
const Taxi = artifacts.require('./TaxiTxRx.sol');

module.exports = function (deployer) {
  deployer.deploy(Taxi)
  .then(() =>{
      if (Taxi._json) {
          fs.writeFile('deployedABI', JSON.stringify(Taxi._json.abi),
          (err) => {
              if (err) throw err;
              console.log("파일에 ABI 입력 성공");
          }
          )

          fs.writeFile('deployedAddress', Taxi.address,
            (err) => {
                if (err) throw err;
                console.log("파일에 주소 입력 성공");
            }
          )
      }
  })
}
