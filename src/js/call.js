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
    acceptCall : async (event) => {
        const addr = event.target.getAttribute('aria-addr');
        const reserv = agContract.methods.getLastReservation(addr).call();
        if (reserv.cancelled == true || reserv.pay_completed == true || reserv.driver != reserv.target){
            alert('만료된 요청입니다.');
            return;
        }

        const result = await agContract.methods.acceptReserv(addr).send({from : Session.auth.wallet_address, gas:'500000'});
        location.href = 'Before-Boarding.html'; // 페이지 이동
    }
}

window.CallFetcher = CallFetcher();
