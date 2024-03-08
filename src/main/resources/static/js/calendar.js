axios.get('/user/schedule')
    .then(res => {
        const scheduleList = res.data;
        const events = scheduleList.map(function (schedule) {
            return {
                title : schedule.title,
                start : schedule.startDate,
                end : schedule.endDate
            }
        });

        const calendarEl = $('#calendar')[0];
        const calendar = new FullCalendar.Calendar(calendarEl, {
            height: '700px',
            initialView: 'dayGridMonth',
            navLinks: true, // 날짜를 선택하면 Day 캘린더로 이동
            editable: true, // 수정 가능
            dayMaxEvents: true, // 이벤트가 오버되면 높이 제한 (+ 몇 개식으로 표현)
            themeSystem: 'bootstrap',	// 이렇게 설정하면 다크모트 라이트모드 가능
            locale: 'ko', // 한국어 설정
            // 헤더에 표시할 툴바
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listDay'
            },

            events: events
        });
        calendar.render();
    })
    .catch(err => {
        alert('알 수 없는 오류로 캘린더를 업로드하지 못하였습니다. 잠시 후 다시 시도해 주세요.')
    })