const i = 1;
const test_sps = ['세종','부천','도당','도봉','원미']
const test_dps = ['구로','발산','목동','군자','중동']

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