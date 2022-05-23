import {agContract, Session} from './session.js';

// 1. 예약정보 저장할 공간
export const Reserv = {
    update: async function(){ // 예약정보 업데이트

    }
}

// 2. 예약하기 (출발지, 목적지)

// 3. 기사님 요청수락 콜백 이벤트 ( 예약완료 )
// 기사님이 요청수락 하면, 실행될 함수

// 4. 도착시 콜백 이벤트 (도착완료)
// 기사님이 도착보내면, 실행될함수


// 5. 콜백 등록

agContract.events.checkInTaxiEvent({filter:{
    addr: Session.auth.wallet_address
}}).once('data', function(event){
    console.log('택시 출발체크인')
})

agContract.events.checkOutTaxiEvent({filter:{
    addr: Session.auth.wallet_address
}}).once('data', function(event){
    console.log('택시 도착 체크아웃')
})

