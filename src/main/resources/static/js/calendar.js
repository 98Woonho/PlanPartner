if ($('meta[name="_user-status"]').attr('content') === 'false') {
    alert('로그인 후 이용할 수 있습니다.');
    location.href = "/user/login";
} else {
    axios.get('/user/schedule')
        .then(res => {
            const scheduleList = res.data;
            const events = scheduleList.map(function (schedule) {
                if (schedule.startTime === "") {
                    return {
                        id: schedule.id,
                        title: schedule.title,
                        start: schedule.startDate,
                        end: schedule.endDate
                    }
                } else {
                    return {
                        id: schedule.id,
                        title: schedule.title,
                        start: schedule.startDate + 'T' + schedule.startTime + ':00',
                        end: schedule.endDate + 'T' + schedule.endTime + ':00'
                    }
                }
            });

            console.log(events);

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
                eventClick: function (info) {
                    $('#id').val(info.event._def.publicId);

                    // 캘린더에서 선택한 일정의 시작일과 종료일
                    const originalStartDateString = info.event._instance.range.start;
                    const originalEndDateString = info.event._instance.range.end;

                    // 한국시로 변환되어 DB에서 넣어준 시작일보다 9시간이 더해져 있기 때문에, 9시간을 빼줌
                    const originalStartDate = new Date(originalStartDateString);
                    const adjustedStartDate = new Date(originalStartDate.getTime() - (9 * 60 * 60 * 1000));
                    const startDateString = adjustedStartDate.toString();

                    // 한국시로 변환되어 DB에서 넣어준 종료일보다 9시간이 더해져 있기 때문에, 9시간을 빼줌
                    const originalEndDate = new Date(originalEndDateString);
                    const adjustedEndDate = new Date(originalEndDate.getTime() - (9 * 60 * 60 * 1000));
                    const endDateString = adjustedEndDate.toString();

                    // Date 객체로 변환
                    const startDateObject = new Date(startDateString);
                    const endDateObject = new Date(endDateString);

                    // 년도 추출
                    const startYear = startDateObject.getFullYear();
                    const endYear = endDateObject.getFullYear();

                    // 월 추출
                    const startMonth = (startDateObject.getMonth() + 1).toString().padStart(2, '0');
                    const endMonth = (endDateObject.getMonth() + 1).toString().padStart(2, '0');

                    // 일 추출
                    const startDay = startDateObject.getDate().toString().padStart(2, '0');
                    const endDay = endDateObject.getDate().toString().padStart(2, '0');

                    // 원하는 형식으로 변환
                    const startDate = `${startYear}-${startMonth}-${startDay}`;
                    const endDate = `${endYear}-${endMonth}-${endDay}`;

                    $('#datepicker1').val(startDate);
                    $('#datepicker2').val(endDate);

                    if (info.event._def.allDay) {
                        $("#allDayCheckBox").prop('checked', true);
                        $("#startTime").attr('disabled', '');
                        $("#endTime").attr('disabled', '');
                    } else {
                        $("#allDayCheckBox").prop('checked', false);
                        $("#startTime").removeAttr('disabled', '');
                        $("#endTime").removeAttr('disabled', '');

                        // 시간 추출
                        const startHours = startDateObject.getHours().toString().padStart(2, '0');
                        const endHours = endDateObject.getHours().toString().padStart(2, '0');

                        // 분 추출
                        const startMinutes = startDateObject.getMinutes().toString().padStart(2, '0');
                        const endMinutes = endDateObject.getMinutes().toString().padStart(2, '0');

                        // 원하는 형식으로 변환
                        const startTime = `${startHours}:${startMinutes}`;
                        const endTime = `${endHours}:${endMinutes}`;

                        $('#startTime').val(startTime);
                        $('#endTime').val(endTime);
                    }

                    $('#title').val(info.event._def.title);

                    const hours = startDateObject.getHours().toString().padStart(2, '0');
                    const minutes = startDateObject.getMinutes().toString().padStart(2, '0');

                    const formattedTime = `${hours}:${minutes}`;

                    $('#scheduleModify').addClass('visible');
                },
                events: events
            });
            calendar.render();
        })
        .catch(err => {
            console.log(err);
            alert('알 수 없는 오류로 캘린더를 업로드하지 못하였습니다. 잠시 후 다시 시도해 주세요.')
        })


    $('#scheduleModify').on({
        'click': function () {
            $('#scheduleModify').removeClass('visible');
        }
    })

    $('#scheduleModifyForm').on(
        'click', function (event) {
            event.stopPropagation();
        });

    $('#allDayCheckBox').on({
        'change': function () {
            if ($(this).is(':checked')) {
                $("#startTime").attr('disabled', '');
                $("#endTime").attr('disabled', '');
            } else {
                $("#startTime").removeAttr('disabled', '');
                $("#endTime").removeAttr('disabled', '');
            }
        }
    })

    $('#modifyBtn').on({
        'click': function (e) {
            e.preventDefault();

            const formData = $('#scheduleModifyForm').serialize();

            axios.patch('/user/schedule', formData)
                .then(res => {
                    if(res.data === 'SUCCESS') {
                        alert('일정 수정이 완료 되었습니다.');
                        location.href = '/calendar';
                    }

                    if(res.data === 'ACCOUNT_MISMATCH') {
                        alert('계정이 일치하지 않습니다.');
                        location.href = '/';
                    }
                })
                .catch(err => {
                    alert('알 수 없는 이유로 일정 수정에 실패 하였습니다. 잠시 후 다시 시도해 주세요.');
                })
        }
    })

    $('#deleteBtn').on({
        'click': function (e) {
            e.preventDefault();

            if(confirm('정말로 일정을 삭제 할까요?')) {
                const id = $('#id').val();

                axios.delete(`/user/schedule?id=${id}`)
                    .then(res => {
                        if(res.data === 'SUCCESS') {
                            location.href = '/calendar';
                        }

                        if(res.data === 'ACCOUNT_MISMATCH') {
                            alert('계정이 일치하지 않습니다.');
                            location.href = '/';
                        }
                    })
                    .catch(err => {
                        alert('알 수 없는 이유로 일정 삭제에 실패 하였습니다. 잠시 후 다시 시도해 주세요.');
                    })
            }
        }
    })
}