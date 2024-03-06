$('#loginForm').submit(function (e) {
    e.preventDefault();

    if ($('#email').val() === '') {
        alert('이메일을 입력해 주세요.');
        return false;
    }

    if ($('#password').val() === '') {
        alert('비밀번호를 입력해 주세요.');
        return false;
    }

    if (!new RegExp($('#email').attr('regex')).test($('#email').val())) {
        $('#failText').text('유효하지 않은 이메일입니다.');
        $('#failText').removeAttr('hidden');
        return false;
    }

    const formData = $('#loginForm').serialize();

    axios.post('/user/login', formData)
        .then(res => {
            if (res.data === "NOT_FOUND") {
                $('#failText').text('이메일 또는 비밀번호가 올바르지 않습니다.');
                $('#failText').removeAttr('hidden');
            }
            if (res.data === "SUCCESS") {
                location.href='/';
            }
        })
        .catch(err => {
            alert('알 수 없는 이유로 로그인에 실패 하였습니다. 잠시 후 다시 시도해 주세요.');
        })
})