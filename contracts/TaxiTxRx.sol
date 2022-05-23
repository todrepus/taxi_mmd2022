// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract TaxiTxRx {
    enum UserRank {Client, Driver, Admin}

    struct Reservation{
        address target; // 예약자 주소
        uint occur; // 예약 발생시간 (timestamp)
        uint start; // 탑승 시작시간
        uint end; // 거래 완료시간
        uint8 paid; // 비용
        bool pay_completed; // 결제완료여부
        bool cancelled; // 취소여부
        string start_point; // 출발지
        string dest_point;  // 목적지
    }


    struct User{
        string phone_number; // 핸드폰번호
        string name; // 이름
        uint balance; // 잔고
        bool created; // 생성여부
    }


    event addReservEvent();
    event checkInTaxiEvent(address indexed addr);
    event checkOutTaxiEvent(address indexed addr);
    event cancelLastReservEvent(address indexed addr);
    event payCompleteEvent(address indexed addr);

    address public owner; // 스마트계약서 작성자
    mapping (address => User) public users; // 사용자 정보목록
    mapping (address => UserRank) public user_ranks; // 유저 타입
    mapping (address => Reservation[]) public user_reservs; // 사용자별 예약목록

    constructor(){
        owner = msg.sender;
    }

    // 계좌 잔고 가져오기.
    function getBalance(address caller) public view returns (uint) {
        require(users[caller].created == true);
        return users[caller].balance;
    }

    // 사용자 정보 가져오기.
    function getUser(address caller) public view returns (User memory){
        require(users[caller].created == true);
        return users[caller];
    }

    // 사용자 예약목록 가져오기.
    function getReservationList(address caller) public view returns (Reservation[] memory) {
        require(users[caller].created == true);
        return user_reservs[caller];
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

    // 사용자 등록.
    function addUser(string memory phone_number, string memory name) public {
        require(users[msg.sender].created == false);
        users[msg.sender] = User(phone_number, name, 0, true);
        user_ranks[msg.sender] = UserRank.Client;
        
    }

    // 예약 등록
    function addReserv(string memory sp, string memory dp) public {
        require(users[msg.sender].created == true);
        user_reservs[msg.sender].push(Reservation(msg.sender, block.timestamp, 0, 0, 0, false, false, sp, dp));
        emit addReservEvent();
    }

    // 탑승시간 등록
    function checkInTaxi() public {
        require(users[msg.sender].created == true && _getLastReservation(msg.sender).cancelled == false && _getLastReservation(msg.sender).start == 0);
        _getLastReservation(msg.sender).start = block.timestamp;
        emit checkInTaxiEvent(_getLastReservation(msg.sender).target);
    }

    // 하차시간 등록 및 결제요금 추가
    function checkOutTaxi(uint8 paid) public {
        require(users[msg.sender].created == true && user_reservs[msg.sender].length > 0);
        Reservation storage last = _getLastReservation(msg.sender);
        last.end = block.timestamp; // 현재시간
        last.paid = paid;
        emit checkOutTaxiEvent(last.target);
    }
    
    // 예약 취소
    function cancelLastReserv() public {
        require(users[msg.sender].created == true && _getLastReservation(msg.sender).start == 0);
        Reservation storage last = _getLastReservation(msg.sender);
        last.cancelled = true;
        emit cancelLastReservEvent(last.target);
    }

    // 결제 완료
    function setPayCompleteLastReserv() public{
        require(users[msg.sender].created == true && _getLastReservation(msg.sender).end != 0);
        Reservation storage last = _getLastReservation(msg.sender);
        last.pay_completed = true;
        emit payCompleteEvent(last.target);
    }

    // 사용자 타입을 관리자로 설정.
    function setUserToAdmin(address target) public {
        require(msg.sender == owner && users[msg.sender].created == true);
        user_ranks[target] = UserRank.Admin;
    }

    // 사용자 타입을 택시기사로 설정.
    function setUserToDriver(address target) public {
        require(msg.sender == owner || (users[msg.sender].created == true && user_ranks[msg.sender] == UserRank.Admin));
        user_ranks[target] = UserRank.Driver;
    }

}