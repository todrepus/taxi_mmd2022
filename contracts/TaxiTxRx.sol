// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract TaxiTxRx {
    struct Reservation{
        address target; // 예약자 주소
        address driver; // 운전자 주소
        uint occur; // 예약 발생시간 (timestamp)
        uint start; // 탑승 시작시간
        uint end; // 거래 완료시간
        uint16 paid; // 비용
        bool pay_completed; // 결제완료여부
        bool cancelled; // 취소여부
        string start_point; // 출발지
        string dest_point;  // 목적지
    }


    struct User{
        bytes16 phone_number; // 핸드폰번호
        bytes32 name; // 이름
        bytes32 nickname; // 별명
        bytes32 email; // 이메일
        bool created; // 생성여부
    }

    struct Driver{
        bytes16 phone_number; // 핸드폰번호
        bytes16 car_number; // 차량번호
        bytes32 name; // 이름
        bytes32 nickname; // 별명
        bytes32 email; // 이메일
        address target; // 현재 거래중인 사용자
        bool created; // 생성여부
        bool driving; // 거래중여부
    }

    struct StringUser{
        string phone_number;
        string name;
        string nickname;
        string email;
        bool created;
    }

    struct StringDriver{
        string phone_number; // 핸드폰번호
        string car_number; // 차량번호
        string name; // 이름
        string nickname; // 별명
        string email; // 이메일
        address target; // 현재 거래중인 사용자
        bool created; // 생성여부
        bool driving; // 거래중여부
    }


    event addReservEvent();
    event acceptReservEvent(address indexed addr);
    event checkInTaxiEvent(address indexed addr);
    event checkOutTaxiEvent(address indexed addr);
    event cancelLastReservEvent(address indexed addr);
    event payCompleteEvent(address indexed addr);

    address public owner; // 스마트계약서 작성자

    mapping (address => User) public users; // 사용자 정보목록
    mapping (address => Driver) public drivers; // 택시기사 목록
    mapping (address => Reservation[]) public user_reservs; // 사용자별 예약목록

    address[] recent_addReserv_addrs; // 최근 예약요청을한 사용자들 목록

    constructor(){
        owner = msg.sender;
    }


    // 사용자 정보 가져오기.
    function getStringUser(address caller) public view returns (StringUser memory){
        require(users[caller].created == true);
        return ToStringUser(users[caller]);
    }

    // 사용자 마지막 예약 가져오기. 현재 진행중인 예약도 해당됨. (외부 호출용)
    function getLastReservation(address caller) public view returns (Reservation memory){
        require(users[caller].created == true);
        uint size = user_reservs[caller].length;
        return user_reservs[caller][size-1];
    }

    // 사용자 마지막 예약 가져오기. (내부 호출용)
    function _getLastReservation(address caller) internal view returns (Reservation storage){
        require(users[caller].created == true);
        uint size = user_reservs[caller].length;
        return user_reservs[caller][size-1];
    }

    // 사용자 예약목록 가져오기. [ 사용자용 ]
    function getReservationList(address caller) public view returns (Reservation[] memory) {
        require(users[caller].created == true);
        return user_reservs[caller];
    }


    // 사용자 등록. [ 사용자용 ]
    function addUser(string memory phone_number, string memory name, string memory nickname, string memory email) public {
        require(users[msg.sender].created == false);
        users[msg.sender] = User(ToBytes16(phone_number), ToBytes32(name),ToBytes32(nickname), ToBytes32(email), true);
        
    }

    // 예약 등록 [ 사용자용 ]
    function addReserv(string memory sp, string memory dp) public {
        require(users[msg.sender].created == true);
        require(user_reservs[msg.sender].length == 0 || (user_reservs[msg.sender].length > 0 && getLastReservation(msg.sender).occur == 0));
        user_reservs[msg.sender].push(Reservation(msg.sender, msg.sender, block.timestamp, 0, 0, 0, false, false, sp, dp));
        recent_addReserv_addrs.push(msg.sender);
        emit addReservEvent();
    }

    // 예약 취소 [ 사용자용 ]
    function cancelLastReserv() public {
        require(users[msg.sender].created == true && (user_reservs[msg.sender].length > 0 && getLastReservation(msg.sender).start == 0));
        Reservation storage last = _getLastReservation(msg.sender);
        if (last.driver == msg.sender){
            uint size = user_reservs[last.target].length;
            delete user_reservs[last.target][size-1];
        }else{
            last.cancelled = true;
            last.paid = 1000; // 예약금.
            emit cancelLastReservEvent(last.target);
        }
    }

    // 결제 완료 [ 사용자용 ]
    function setPayCompleteLastReserv() public{
        require(users[msg.sender].created == true && (user_reservs[msg.sender].length > 0 && getLastReservation(msg.sender).end != 0));
        Reservation storage last = _getLastReservation(msg.sender);
        last.pay_completed = true;
        Driver storage driver = drivers[last.driver];
        driver.driving = false;
        emit payCompleteEvent(last.target);
    }

    // 운전기사 정보 업데이트 [ 택시기사용 ]
    function getStringDriver(address caller) public view returns(StringDriver memory){
        require(drivers[caller].created == true);
        return ToStringDriver(drivers[caller]);
    }
    // 운전기사 등록 [ 택시기사용 ]
    function addDriver(string memory phone_number, string memory car_number, string memory name, string memory nickname, string memory email) public {
        require(drivers[msg.sender].created == false);
        drivers[msg.sender] = Driver(ToBytes16(phone_number), ToBytes16(car_number), ToBytes32(name), ToBytes32(nickname), ToBytes32(email),
        msg.sender, true, false);
        
    }
    // 요청 수락 [ 택시기사용 ]
    function acceptReserv(address target) public {
        require(drivers[msg.sender].created == true && drivers[msg.sender].driving == false);
        require(users[target].created == true && getLastReservation(target).start == 0);
        Driver storage driver = drivers[msg.sender];
        driver.target = target;
        driver.driving = true;

        Reservation storage last = _getLastReservation(target);
        last.driver = msg.sender;

        emit acceptReservEvent(last.target);
    }
    // 탑승시간 등록 [ 택시기사용 ]
    function checkInTaxi() public {
        require(drivers[msg.sender].created == true && drivers[msg.sender].driving);
        Driver memory driver = drivers[msg.sender];
        address caller = driver.target;

        require(users[caller].created == true && getLastReservation(caller).cancelled == false && getLastReservation(caller).start == 0);
        _getLastReservation(caller).start = block.timestamp;
        emit checkInTaxiEvent(getLastReservation(caller).target);
    }

    // 하차시간 등록 및 결제요금 추가 [ 택시기사용 ]
    function checkOutTaxi(uint16 paid) public {
        require(drivers[msg.sender].created == true && drivers[msg.sender].driving);
        Driver memory driver = drivers[msg.sender];
        address caller = driver.target;

        require(users[caller].created == true && user_reservs[caller].length > 0);
        Reservation storage last = _getLastReservation(caller);
        last.end = block.timestamp; // 현재시간
        last.paid = paid;
        emit checkOutTaxiEvent(last.target);
    }
    
    
    // 요청목록 페이지네이션 [ 택시기사용 ]
    function fetchReserv(uint length, uint cursor) public view returns(Reservation[] memory, uint){
        uint offset = recent_addReserv_addrs.length;
        uint start = offset - cursor - length;
        uint end = (offset - cursor);

        if (start < 0){
            length += start;
            start = 0;
        }
        
        Reservation[] memory reservs = new Reservation[](length);
        uint j = 0;
        for (uint i=end-1; i>=start; i++){
            reservs[j] = getLastReservation(recent_addReserv_addrs[i]);
            j++;
        }
        return (reservs, cursor - length);
    }

    // 기타 유틸함수

    function ToBytes32(string memory x) internal pure returns (bytes32){
        return bytes32(bytes(x));
    }

    function ToBytes16(string memory x) internal pure returns (bytes16){
        return bytes16(bytes(x));
    } 

    function bytes16ToString(bytes16 _bytes16) internal pure returns (string memory) {
        uint8 i = 0;
        while(i < 16 && _bytes16[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 16 && _bytes16[i] != 0; i++) {
            bytesArray[i] = _bytes16[i];
        }
        return string(bytesArray);
    }

    function bytes32ToString(bytes32 _bytes32) internal pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }

    function ToStringUser(User memory x) public pure returns (StringUser memory){
        StringUser memory s_user;
        s_user.phone_number = bytes16ToString(x.phone_number);
        s_user.name = bytes32ToString(x.name);
        s_user.nickname = bytes32ToString(x.nickname);
        s_user.email = bytes32ToString(x.email);
        s_user.created = x.created;
        return s_user;
    }

    function ToStringDriver(Driver memory x) public pure returns (StringDriver memory){
        StringDriver memory s_driver;
        s_driver.phone_number = bytes16ToString(x.phone_number);
        s_driver.car_number = bytes16ToString(x.car_number);
        s_driver.name = bytes32ToString(x.name);
        s_driver.nickname = bytes32ToString(x.nickname);
        s_driver.email = bytes32ToString(x.email);
        s_driver.target = x.target;
        s_driver.driving = x.driving;
        s_driver.created = x.created;
        return s_driver;
    }
}