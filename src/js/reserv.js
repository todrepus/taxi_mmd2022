import {agContract, Session} from './session.js';

// 1. 예약정보 저장할 공간
export const Reserv = {
    data: {
        occur : 0,
        start : 0,
        end : 0,
        paid : 0,
        pay_completed : false,
        cancelled : false,
        start_point : '',
        dest_point : ''
    },
    update: async function(){ // 예약정보 업데이트
        try{
            const result = await agContract.methods.getLastReservation(Session.auth.wallet_address).call();
            console.log(result);
            this.data.occur = result.occur;
            this.data.start = result.start;
            this.data.end = result.end;
            this.data.paid = result.paid;
            this.data.pay_completed = result.pay_completed;
            this.data.cancelled = result.cancelled;
            this.data.start_point = result.start_point;
            this.data.dest_point = result.dest_point;
        }catch (error){
            return false;
        }
        console.log(this);
        return true;

    },
    // 2. 예약하기 (출발지, 목적지)
    push: async function(sp, dp){
        try{
            const result = await agContract.methods.addReserv(sp, dp).send({from : Session.auth.wallet_address, gas:'2000000'});
            console.log(result);
            return true;
        }catch (error){
            console.log(error);
            return false;
        }
    },

    checkInTaxiEventCallback : async function(){
        const success = await this.update();
        if (!success){
            alert('Error');
            return;
        }
        this.process();
    },
    checkOutTaxiEventCallback : async function(){
        const success = await this.update();
        if (!success){
            alert('Error');
            return;
        }

        alert('도착!')
        this.process();
    },

    addCallback : function(){
        agContract.events.checkInTaxiEvent({filter:{
            addr: Session.auth.wallet_address
        }}).on('data', function(event){
            console.log('택시 출발체크인')
            console.log(event);
            Reserv.checkInTaxiEventCallback();
        })
        agContract.events.checkOutTaxiEvent({filter:{
            addr: Session.auth.wallet_address
        }}).on('data', function(event){
            console.log('택시 도착 체크아웃')
            Reserv.checkOutTaxiEventCallback();
        })
        console.log('callback is added');
    },

    process : function(){
        if (this.data.pay_completed){ // 결제가 모두 완료된경우
            alert('예약이 끝에 도달함');
            
        }
        else if (this.data.end != 0){ // 도착완료
            alert('도착완료')
            location.href = 'payment_complete.html';
        }else if (this.data.start != 0){ // 운행중 (체크인)
            document.getElementById('content_reserv').innerHTML = "운행중......";
        }else if (this.data.cancelled){ // 취소인경우
            alert('취소')
            location.href = 'payment_cancel.html'
        }
    }
}


// 3. 기사님 요청수락 콜백 이벤트 ( 예약완료 )
// 기사님이 요청수락 하면, 실행될 함수

// 4. 도착시 콜백 이벤트 (도착완료)
// 기사님이 도착보내면, 실행될함수


// 5. 콜백 등록




window.Reserv = Reserv;