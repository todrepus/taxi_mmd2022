import {Session, agContract} from "./session.js";

function SpaceException(name, message){
    this.name = name;
    this.message = message;
}

function NotPhoneNumberException(name, message){
    this.name = name;
    this.message = message;
}
const User = {
    name: '',
    phone_number: '',
    reserv: '',
    join : false,

    update: async function(){
        try{
            const user = await agContract.methods.getUser(Session.auth.wallet_address).call();
            this.name = user.name;
            this.phone_number = user.phone_number;
            this.join = true;
        }catch (event) {
            this.join = false;
            console.log('Update ERROR');

        }
    },

    addUser: async function(){
        try{
            let phone_number = document.getElementById('phone_number').value
            let name = document.getElementById('name').value
            let nickname = '';
            let email = '';
            phone_number = phone_number.trim()
            name = name.trim()

            if (phone_number === "" || name === ""){
                throw new SpaceException('SpaceException', '핸드폰번호 혹은 이름이 공백입니다.');
            }
            let regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
            if (regPhone.test(phone_number) != true){ // 휴대폰번호 형식이 아니라면,
                throw new NotPhoneNumberException('NotPhoneNumberException', '핸드폰번호 형식 이상합니다.');
            }
            
            await agContract.methods.addUser(phone_number, name, nickname, email).send({from : Session.auth.wallet_address, gas:'500000'});
            alert('가입완료')
        }catch (event){
            if (event instanceof SpaceException ){
                alert(event.message);
            }else if (event instanceof NotPhoneNumberException){
                alert(event.message);
            }
            else{
                alert('가입 실패')
            }
        }
    }
}

const Driver = {
    name: '',
    phone_number: '',
    reserv: '',
    join : false,

    update: async function(){
        try{
            const driver = await agContract.methods.getDriver(Session.auth.wallet_address).call();
            this.name = driver.name;
            this.phone_number = driver.phone_number;
            this.join = true;
        }catch (event) {
            this.join = false;
            console.log('Update driver ERROR');

        }
    },

    addDriver: async function(){
        try{
            let phone_number = document.getElementById('phone_number').value
            let car_number = '';
            let name = document.getElementById('name').value
            let nickname = '';
            let email = '';
            phone_number = phone_number.trim()
            name = name.trim()

            if (phone_number === "" || name === ""){
                throw new SpaceException('SpaceException', '핸드폰번호 혹은 이름이 공백입니다.');
            }
            let regPhone = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
            if (regPhone.test(phone_number) != true){ // 휴대폰번호 형식이 아니라면,
                throw new NotPhoneNumberException('NotPhoneNumberException', '핸드폰번호 형식 이상합니다.');
            }
            
            await agContract.methods.addUser(phone_number, car_number, name, nickname, email).send({from : Session.auth.wallet_address, gas:'500000'});
            alert('가입완료')
        }catch (event){
            if (event instanceof SpaceException ){
                alert(event.message);
            }else if (event instanceof NotPhoneNumberException){
                alert(event.message);
            }
            else{
                alert('가입 실패')
            }
        }
    }
}



window.User = User;
window.Driver = Driver;

