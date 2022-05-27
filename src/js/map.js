import { REST_API_KEY } from './settings.js';


const MapHelper = {
    juso_arr : [],
    points : ['', ''], // 출발지, 목적지
    now_target_pos : 0,
    //1. 주소검색 처리 함수 ( 출발지 목적지에 넣어주기 위함)
    search: async function(juso) {
        let url = 'https://dapi.kakao.com/v2/local/search/address.json';
        const analyze_type = 'similar';
        const size = 30;

        url = url + `?analyze_type=${analyze_type}&size=${size}&query=${juso}`;
        url = encodeURI(url);
        fetch(url, {
            method: "GET",
            headers: {
                "Authorization" : `KakaoAK ${REST_API_KEY}`
            }
        })
        .then((response) => response.json())
        .then((data) => this.updateModal(data));
    },

    //2. 지도 표기 함수 (주어진 위치를 지도에 표기)
    updateModal: function (data){
        this.juso_arr = data.documents;
        console.log(this.juso_arr);
        
        const ul = document.getElementById('juso_ul');
        ul.innerHTML = '';

        let i = 0;
        this.juso_arr.forEach(
            juso => {
                const li_str = 
                `
                <button class="list-group-item list-group-item-action" onclick="MapHelper.updateDetail(${i})">${juso.road_address.address_name}</button>
                `
                const li = document.createElement('li');
                li.innerHTML = li_str;
                ul.appendChild(li);
                i+=1;
            }
        )
    },

    updateDetail: function(i){
        const juso = this.juso_arr[i];
        document.getElementById('detail').style.visibility = "visible";
        document.getElementById('selected_juso').innerHTML = juso.road_address.address_name;
        document.getElementById('addBtn').onclick = () => {
            this.points[this.now_target_pos] = `${juso.road_address.address_name} ${document.getElementById('juso_detail').value}`;
            this.updateInputs();
        }
    },

    updateInputs: function(){
        const sp = document.getElementById('start_point');
        const dp = document.getElementById('dest_point');

        sp.value = this.points[0];
        dp.value = this.points[1];
    }
}

window.MapHelper = MapHelper;

window.onload = () =>{
    const jusoModal = document.getElementById('jusoModal');
    
    jusoModal.addEventListener('show.bs.modal', function (event){
        const input = event.relatedTarget;
        const from = input.getAttribute('data-bs-from');

        let i = 0; // 
        if (from === "dest_point"){
            i = 1; // 목적지로 설정
        }
        MapHelper.now_target_pos = i;
    });

    jusoModal.addEventListener('hidden.bs.modal', function (event){
        document.getElementById('juso_input').value = '';
        document.getElementById('selected_juso').value = '';
        document.getElementById('juso_detail').value = '';

        document.getElementById('detail').style.visibility = 'hidden';
        document.getElementById('juso_ul').innerHTML = '';


    });
}