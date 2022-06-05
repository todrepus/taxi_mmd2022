import {Session, agContract} from './session.js';
import {Reserv} from './reserv.js';



const Payment = {
    Pay_Working : false,
    Pay : async function(){
        if (this.Pay_Working) // 결제 연타 방지
            return;
        const paid = Reserv.data.paid;
        const result = await this.PayAPI(paid);
        if (!result){
            alert('결제에 실패하였습니다.');
            console.log('결제에 실패');
        }else{
            const ts = await agContract.methods.setPayCompleteLastReserv().send({from : Session.auth.wallet_address, gas:'500000'});
            console.log(ts);
            alert('결제에 성공하였습니다.');
            location.href = 'Payment-Complete.html';
        }

        this.Pay_Working = true;
    },
    PayAPI : async function(paid){
        return true; // 나중에 결제 api를 통해 실패하면 false를 반환하고, 성공하면 true를 반환하도록 수정.
    },
    SendPaid: async function(){ // 얼마 지불해야하는지 보내기
        let paid = document.getElementById('paid').value;
        try{
        const ts = await agContract.methods.checkOutTaxi(paid).send({from : Session.auth.wallet_address, gas:'500000'});
        alert('전송완료')
        }catch (error){
            console.log(error);
            alert(error);
        }
        
    },
    CheckInTaxi: async function(){
        try{
            const ts = await agContract.methods.checkInTaxi().send({from : Session.auth.wallet_address, gas:'500000'});
            alert('체크인완료')
            location.href = 'Driving.html';
        }catch (error){
            console.log(error);
            alert(error);
        }
    },
}
// 1. 예약 정보로부터, 결제요금 받아오는 함수


// 2. 결제함수

window.Payment = Payment;
