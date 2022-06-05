import {agContract, Session} from './session.js';
import {Reserv} from './reserv.js';

const limit = 10; // 한번에 불러올 call 갯수
const CallFetcher = {
    cursor : 0,
    fetch : async() => {
        const results = await agContract.methods.fetchReserv(limit, cursor).call();
        return results;
    },

    update : async() => {
        const results = await fetch();
        const reservs = results[0];
        this.cursor = results[1];

        for (const reserv of reservs) {
            createCall(reserv);
          }
    },
    createCall : (reserv) => {
        
        const tag_string = 
        `
        <td>ㅁㅁ</td>
        <td>${reserv.start_point}</td>
        <td>${reserv.dest_point}</td>
        <td>1000원</td>
        <td style="text-align: center" ><a class="btn btn-primary" aria-addr=${reserv.target} onclick="">수락</a></td>
        `;
        const call_tbody = document.getElementById('calls');
        const tr = document.createElement('tr');
        tr.innerHTML = tag_string;
        call_tbody.appendChild(tr);
    },
    acceptCall : (event) => {
        const addr = event.target.getAttribute('aria-addr');
        const reserv = agContract.methods.getLastReservation(addr).call();
        if (reserv.cancelled == true || reserv.pay_completed == true || reserv.driver != reserv.target){
            alert('만료된 요청입니다.');
            return;
        }

        const result = await agContract.methods.acceptReserv(addr).send({from : Session.auth.wallet_address, gas:'500000'});
        console.log(result);
    }
}

function fetch(){
    const info = {
        name : `손님${i}`,
        pn : '010-1234-5678',
        sp : test_sps[(i-1)%5],
        dp : test_dps[(i-1)%5]
    };
    i += 1;
    return info;
}   

function append_call(info){
    const name = info.name;
    const phone_number = info.pn;
    const start_point = info.sp;
    const dest_point = info.dp;

    const tag_string = `<div class="call">
    <div class="card customer-label content center" >
        <span>손님1</span>
    </div>
    <div class="content" style="z-index:1;">
        <div class="content border_box card" style="padding:10px; margin:10px; border:1px solid;">
            <div style='font-size:1rem'>
                <div>
                    <span>이름: </span>
                    <span class='name' style='border-bottom:1px solid;'>${name}</span>
                </div>
                <div>
                    <span>전화번호: </span>
                    <span class='phone_number' style='border-bottom:1px solid;'>${phone_number}</span>
                </div>
                <div>
                    <span>출발지: </span>
                    <span class='start_point' style='border-bottom:1px solid;'>${start_point}</span>
                </div>
                <div>
                    <span>도착지: </span>
                    <span class='dest_point' style='border-bottom:1px solid;'>${dest_point}</span>
                </div>
            </div>
        </div>
        <div class="content center">
            <button style="width:150px;">수락</button>
        </div>
    </div>
</div>`;
    
    const call_ul = document.getElementById('calls');
    const li = document.createElement('li');
    li.innerHTML = tag_string;
    call_ul.appendChild(li);
}