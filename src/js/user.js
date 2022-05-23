import {Session, agContract} from "./session.js";

const User = {
    name: '',
    phone_number: '',
    reserv: '',
    balance : 0,

    update: async function(){
        console.log(agContract);
        const user = await agContract.methods.getUser(Session.auth.wallet_address).call();
        this.name = user.name;
        this.phone_number = user.phone_number;
        this.balance = user.balance;
    }
}


window.User = User;