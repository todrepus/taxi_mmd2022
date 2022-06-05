import {agContract, Session} from './session.js';
import {MAX_ELAPSED_SEC} from './settings.js';

// 1. 예약정보 저장할 공간
export const Reserv = {
    data: {
        occur : 0,
        start : 0,
        end : 0,
        paid : 0,
        driver : '',
        pay_completed : false,
        cancelled : false,
        start_point : '',
        dest_point : ''
    },
    update: async function(target=Session.auth.wallet_address){ // 예약정보 업데이트
        try{
            const result = await agContract.methods.getLastReservation(target).call();

            console.log(result);
            this.data.occur = result.occur;
            this.data.start = result.start;
            this.data.end = result.end;
            this.data.paid = result.paid;
            this.data.pay_completed = result.pay_completed;
            this.data.cancelled = result.cancelled;
            this.data.start_point = result.start_point;
            this.data.dest_point = result.dest_point;
            this.data.driver = result.driver;
        }catch (error){
            return false;
        }
        console.log(this);
        return true;

    },
    // 2. 예약하기 (출발지, 목적지)
    push: async function(sp, dp){
        try{
            const result = await agContract.methods.addReserv(sp, dp).send({from : Session.auth.wallet_address, gas:'500000'});
            
            console.log(result);
            alert('성공');
            return true;
        }catch (error){
            
            console.log(error);
            alert('성공2');
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
            location.href = 'index_client.html' // 처음으로 돌아가
        }
        else if (this.data.end != 0){ // 도착완료
            alert('도착완료')
            location.href = '도착시 결제페이지.html';
        }else if (this.data.start != 0){ // 운행중 (체크인)
            alert('체크인완료');
            //document.getElementById('content_reserv').innerHTML = "운행중......";
        }else if (this.data.cancelled){ // 취소인경우
            alert('취소')
            location.href = '예약 취소시 결제페이지.html'
        }
    },

    cancel: async function() {
        const success = await this.update();
        if (!success){
            alert('정보 불러오기 실패');
            return;
        }

        if (this.data.start != 0){
            alert('출발 이후엔 취소 불가능합니다.');
            return;
        }

        const now = new Date().getTime(); // 현재timestamp 
        const elapsedSec = (now  - (this.data.start*1000)) / (1000); // 몇초 지났는가
        if (elapsedSec > MAX_ELAPSED_SEC){ // 일정시간이상 지나면, 취소를 못하도록한다. ( 택시기사 보호차원 )
            alert(`${MAX_ELAPSED_SEC/60}분 이후에는 취소가 불가능합니다.`);
            return;
        }

        try{
            const transaction = await agContract.methods.cancelLastReserv().send({from : Session.auth.wallet_address, gas:'500000'});
            console.log(transcation);
            alert('취소하였습니다.')
            await this.update();
            this.process();
        }catch (error){
            alert('취소에 실패했습니다.')
            
        }
    }
}


// 3. 기사님 요청수락 콜백 이벤트 ( 예약완료 )
// 기사님이 요청수락 하면, 실행될 함수

// 4. 도착시 콜백 이벤트 (도착완료)
// 기사님이 도착보내면, 실행될함수


// 5. 콜백 등록




window.Reserv = Reserv;