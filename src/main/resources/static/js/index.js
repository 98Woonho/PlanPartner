const scheduleAdd = () => {
    $('#scheduleAdd').addClass('visible');
}

$('#scheduleAdd').on({
    'click': function () {
        $('#scheduleAdd').removeClass('visible');
    }
})

$('#scheduleAddForm').on(
    'click', function (event) {
        event.stopPropagation();
    });

$("#allDayCheckBox").on({
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

$("#scheduleAddForm").submit(function (e) {
    e.preventDefault();

    if ($('#title').val() === '') {
        alert('제목을 입력해 주세요.');
        return false;
    }

    const formData = $('#scheduleAddForm').serialize();

    axios.post('/user/schedule', formData)
        .then(res => {
            alert('일정 추가가 완료 되었습니다.');
            location.href = '/';
        })
        .catch(err => {
            alert('알 수 없는 이유로 일정 추가에 실패 하였습니다. 잠시 후 다시 시도해 주세요.');
        })
})