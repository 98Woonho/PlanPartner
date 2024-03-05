var calendarEl = $('#calendar')[0];
var calendar = new FullCalendar.Calendar(calendarEl, {
    height: '700px',
    initialView: 'dayGridMonth',
    navLinks: true, // 날짜를 선택하면 Day 캘린더로 이동
    editable: true, // 수정 가능
    dayMaxEvents: true, // 이벤트가 오버되면 높이 제한 (+ 몇 개식으로 표현)
    locale: 'ko', // 한국어 설정
    // 헤더에 표시할 툴바
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listDay'
    },

    events: [
        {
            title: 'All Day Event',
            start: '2024-03-01',
        },
        {
            title: 'Long Event',
            start: '2024-03-07',
            end: '2024-03-10'
        },
        {
            title: 'Repeating Event',
            start: '2024-03-06T16:00:00'
        },
        {
            title: 'Repeating Event',
            end: '2024-03-10'
        },
        {
            title: 'Repeating Event',
            start: '2024-03-09T16:00:00'
        },
        {
            title: 'Repeating Event',
            start: '2024-03-16T16:00:00'
        },
        {
            title: 'Conference',
            start: '2024-03-06',
            end: '2024-03-13'
        },
        {
            title: 'Meeting',
            start: '2024-03-12T10:30:00',
            end: '2024-03-12T12:30:00'
        },
        {
            title: 'Lunch',
            start: '2024-03-12T12:00:00'
        },
        {
             title: 'Meeting',
             start: '2024-03-12T14:30:00'
        },
        {
             title: 'Happy Hour',
             start: '2024-03-12T17:30:00'
        },
        {
            title: 'Dinner',
            start: '2024-03-12T20:00:00'
        },
        {
            title: 'Birthday Party',
            start: '2024-03-13T07:00:00'
        },
        {
            title: 'Click for Google',
            url: 'http://google.com/', // 클릭시 해당 url로 이동
            start: '2024-03-28'
        }
    ]
});
calendar.render();