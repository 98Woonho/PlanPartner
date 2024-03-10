$("#datepicker1")
    .datepicker({
        dateFormat: 'yy-mm-dd' //달력 날짜 형태
        , showMonthAfterYear: true // 월- 년 순서가아닌 년도 - 월 순서
        , monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'] //달력의 월 부분 텍스트
        , monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'] //달력의 월 부분 Tooltip
        , dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'] //달력의 요일 텍스트
        , dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'] //달력의 요일 Tooltip
        , minDate: "0D" //최소 선택일자(-1D:하루전, -1M:한달전, -1Y:일년전)
        , onSelect: function (selectedDate) {
            const nextDayDate = new Date(selectedDate);
            nextDayDate.setDate(nextDayDate.getDate());
            $("#datepicker2").datepicker("option", "minDate", nextDayDate);
        }
    });
if (window.location.pathname === "/") {
    $("#datepicker1").datepicker("setDate", new Date());
}

$("#datepicker2")
    .datepicker({
        dateFormat: 'yy-mm-dd' //달력 날짜 형태
        , showMonthAfterYear: true // 월- 년 순서가아닌 년도 - 월 순서
        , monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'] //달력의 월 부분 텍스트
        , monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'] //달력의 월 부분 Tooltip
        , dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'] //달력의 요일 텍스트
        , dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'] //달력의 요일 Tooltip
        , minDate: "0D" //최소 선택일자(-1D:하루전, -1M:한달전, -1Y:일년전)
    });
if (window.location.pathname === "/") {
    $("#datepicker2").datepicker("setDate", new Date());
}

let isNightMode = localStorage.getItem('nightMode') === 'true';

// 초기 로딩 시 야간 모드 상태에 따라 클래스 추가/제거
if (isNightMode) {
    $('body').addClass('dark');
}

$('#nightModeBtn').on({
    'click':function(e) {
        e.preventDefault();

        // 현재 야간 모드 상태 토글
        isNightMode = !isNightMode;

        // 야간 모드 상태를 로컬 스토리지에 저장
        localStorage.setItem('nightMode', isNightMode);

        // body에 dark 클래스를 추가/제거
        $('body').toggleClass('dark');
    }
})