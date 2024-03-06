const loading = $('#loading');

if (loading) {
    loading.hide = function () {
        loading.removeClass('visible');
    }
    loading.show = function () {
        loading.addClass('visible');
    }
}

$('#emailSendBtn').on({
    'click': function (e) {
        e.preventDefault();

        const email = $('#email');

        if (email.val() === '') {
            alert('이메일을 입력해 주세요.');
            return false;
        }

        if (!new RegExp(email.attr('regex')).test(email.val())) {
            alert('올바른 이메일을 입력해 주세요.');
            return false;
        }

        loading.show();

        const formData = new FormData();
        formData.append('email', email.val());

        axios.post('/user/sendEmail', formData)
            .then(res => {
                loading.hide();
                if (res.data.result === 'SUCCESS') {
                    $('#salt').val(res.data.salt);
                    $('.email-code-container').addClass('visible');
                    alert('입력하신 이메일로 인증번호가 포함된 메일을 전송하였습니다. 해당 인증번호는 5분간만 유효하니 유의해 주세요.');
                    $('#emailCode').removeAttr('disabled');
                    $('#codeVerifyBtn').removeAttr('disabled');
                } else if (res.data.result === 'FAILURE_DUPLICATE_EMAIL') {
                    alert('해당 이메일은 이미 사용 중입니다. 잠시 후 다시 시도해 주세요.');
                }
            })
            .catch(err => {
                loading.hide();
                alert('알 수 없는 이유로 인증번호를 전송하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            })
    }
})

$('#codeVerifyBtn').on({
    'click': function (e) {
        e.preventDefault();

        const emailCode = $('#emailCode');

        if (emailCode.val() === '') {
            alert('인증번호를 입력해 주세요.');
            return false;
        }

        if (!new RegExp(emailCode.attr('regex')).test(emailCode.val())) {
            alert('올바른 인증번호를 입력해 주세요.');
            return false;
        }

        const formData = new FormData();
        formData.append('email', $('#email').val());
        formData.append('salt', $('#salt').val());
        formData.append('code', emailCode.val());


        axios.patch('/user/sendEmail', formData)
            .then(res => {
                if (res.data === 'SUCCESS') {
                    alert('인증번호가 정상적으로 확인 되었습니다.');
                    $('#emailCode').attr('disabled', '');
                    $('#codeVerifyBtn').attr('disabled', '');
                } else if (res.data === 'FAILURE_EXPIRED') {
                    alert('인증번호를 5분 내에 입력하지 않아 만료 되었습니다. 아래 확인 버튼을 눌러 이메일 인증을 재진행해 주세요.');
                } else if (res.data === 'FAILURE_INVALID_CODE') {
                    alert('이메일 인증번호가 올바르지 않습니다. 입력하신 인증번호를 다시 확인해 주세요.');
                }
            })
            .catch(err => {
                alert('알 수 없는 이유로 인증번호를 전송하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            })

    }
})

$('#email').on({
    'blur': function () {
        const emailWarning = $('#emailWarning');

        if ($(this).val() === '') {
            emailWarning.text('이메일을 입력해 주세요.');
            return false;
        }

        if (!new RegExp($(this).attr('regex')).test($(this).val())) {
            emailWarning.text('올바른 이메일을 입력해 주세요.');
            return false;
        }

        emailWarning.text('');
    }
})

$('#password').on({
    'focus': function() {
        $('.password-warning-container').addClass('visible');
    },
    'keyup': function () {
        const passwordWarning = $('#passwordWarning');

        if (!($(this).val() === '') && new RegExp($(this).attr('regex')).test($(this).val())) {
            $('#x').attr('hidden', '');
            $('#check').removeAttr('hidden');
            passwordWarning.addClass('verified').removeClass('warning');
        } else {
            $('#x').removeAttr('hidden');
            $('#check').attr('hidden', '');
            passwordWarning.addClass('warning').removeClass('verified');
        }
    }
})

$('#name').on({
    'blur': function () {
        const nameWarning = $('#nameWarning');

        if ($(this).val() === '') {
            nameWarning.text('이름을 입력해 주세요.');
            return false;
        }

        if (!new RegExp($(this).attr('regex')).test($(this).val())) {
            nameWarning.text('올바른 이름을 입력해 주세요.');
            return false;
        }

        nameWarning.text('');
    }
})

$('#joinForm').submit(function (e) {
    e.preventDefault();

    if ($('#email').val() === '') {
        alert('이메일을 입력해 주세요.');
        return false;
    }

    if (!new RegExp($('#email').attr('regex')).test($('#email').val())) {
        alert('올바른 이메일을 입력해 주세요.');
        return false;
    }

    if ($('#emailCode').val() === '') {
        alert('인증번호를 입력해 주세요.');
        return false;
    }

    if (!new RegExp($('#emailCode').attr('regex')).test($('#emailCode').val())) {
        alert('올바른 인증번호를 입력해 주세요.');
        return false;
    }

    if (!$('#codeVerifyBtn').attr('disabled')) {
        alert('인증번호 확인 버튼을 통해 인증번호를 확인해 주세요.');
        return false;
    }

    if ($('#name').val() === '') {
        alert('이름을 입력해 주세요.');
        return false;
    }

    if (!new RegExp($('#name').attr('regex')).test($('#name').val())) {
        alert('올바른 이름을 입력해 주세요.');
        return false;
    }

    if ($('#password').val() === '') {
        alert('비밀번호를 입력해 주세요.');
        return false;
    }

    if (!new RegExp($('#password').attr('regex')).test($('#password').val())) {
        alert('숫자, 특수문자가 1개 이상 포함된 8자리 이상 15자리 이하의 비밀번호를 입력해 주세요.');
        return false;
    }

    const formData = $('#joinForm').serialize();

    axios.post('/user/join', formData)
        .then(res => {
            alert('회원가입이 완료 되었습니다.');
            location.href = '/user/login';
        })
        .catch(err => {
            alert('알 수 없는 이유로 회원가입에 실패 하였습니다. 잠시 후 다시 시도해 주세요.');
        })
})