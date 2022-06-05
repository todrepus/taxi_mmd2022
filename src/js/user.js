import {Session, agContract} from "./session.js";

function SpaceException(name, message){
    this.name = name;
    this.message = message;
}

function NotPhoneNumberException(name, message){
    this.name = name;
    this.message = message;
}

function UpdateErrorException(message){
    this.name = "UpdateErrorException";
    this.message = message;
}
const User = {
    name: '',
    nickname: '',
    email: '',
    phone_number: '',
    reserv: '',

    update: async function(){
        try{
            const user = await agContract.methods.getStringUser(Session.auth.wallet_address).call();
            this.name = user.name;
            this.phone_number = user.phone_number;
            this.nickname = user.nickname;
            this.email = user.email;
        }catch (event) {
            this.join = false;
            console.log(event);
            console.log('Update ERROR');
            throw UpdateErrorException("업데이트에 실패하였습니다.");
        }
    },

    addUser: async function(event){
        try{
            let phone_number = event.target.form.phone_number.value;
            let name = event.target.form.name.value;
            let nickname = event.target.form.nickname.value;
            let email = event.target.form.email.value;

            phone_number = phone_number.trim()
            name = name.trim();
            nickname = nickname.trim();
            email = email.trim();

            if (name === ""){
                event.target.form.name.focus();
                throw new SpaceException('SpaceException', '이름이 공백입니다.');
            }
            if (nickname === ""){
                event.target.form.nickname.focus();
                throw new SpaceException('SpaceException', '별명이 공백입니다.');
            }

            if (phone_number === ""){
                event.target.form.phone_number.focus();
                throw new SpaceException('SpaceException', '핸드폰번호가 공백입니다.');
            }

            if (email === ""){
                event.target.form.email.focus();
                throw new SpaceException('email', '이메일이 공백입니다.');
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
                console.log(event);
                alert('가입 실패')
            }
        }
    }
}

const Driver = {
    name: '',
    nickname: '',
    email: '',
    car_number: '',
    phone_number: '',

    update: async function(){
        try{
            const driver = await agContract.methods.getStringDriver(Session.auth.wallet_address).call();
            this.name = driver.name;
            this.nickname = driver.nickname;
            this.email = driver.email;
            this.car_number = driver.car_number;
            this.phone_number = driver.phone_number;
        }catch (event) {
            console.log('Update driver ERROR');
            throw UpdateErrorException("업데이트에 실패하였습니다.");
        }
    },

    addDriver: async function(){
        try{
            let phone_number = document.getElementById('phone_number').value
            let car_number = document.getElementById('car_number');
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

