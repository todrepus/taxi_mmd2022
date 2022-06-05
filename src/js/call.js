import {agContract, Session} from './session.js';
import {Reserv} from './reserv.js';

const LIMIT_CALL = 10; // 한번에 불러올 call 갯수
const EMPTY_ADDRESS = '0x0000000000000000000000000000000000000000';
const CallFetcher = {
    cursor : 0,
    fetch : async function() {
        const results = await agContract.methods.fetchReserv(LIMIT_CALL, this.cursor).call();
        return results;
    },

    update : async function() {
        console.log(this.cursor);
        const results = await this.fetch();
        const reservs = results[0];
        this.cursor = results[1];

        for (const reserv of reservs) {
            if (reserv.target == EMPTY_ADDRESS)
                break;
            this.createCall(reserv);
        }
    },
    createCall : async function(reserv) {
        
        const tag_string = 
        `
        <td>ㅁㅁ</td>
        <td>${reserv.start_point}</td>
        <td>${reserv.dest_point}</td>
        <td>1000원</td>
        <td style="text-align: center" ><a class="btn btn-primary" aria-addr=${reserv.target} onclick="CallFetcher.acceptCall(event);">수락</a></td>
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
        alert('수락성공');
        location.href = 'Before-Boarding.html'; // 페이지 이동
    }
}

window.CallFetcher = CallFetcher;
