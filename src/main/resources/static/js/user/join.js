const loading = $('#loading');

if (loading) {
    loading.hide = function() {
        loading.removeClass('visible');
    }
    loading.show = function() {
        loading.addClass('visible');
    }
}


$('#emailSendBtn').on({
    'click': function (e) {
        e.preventDefault();

        const emailValue = $('#email').val();
        const emailRegex = "^(?=.{4,50}$)([\\da-z_\\-.]{4,})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15}\\.)?([a-z]{2,3})$";

        if (emailValue === '') {
            alert('이메일을 입력해 주세요.');
            return false;
        }

        if (!new RegExp(emailRegex).test(emailValue)) {
            alert('올바른 이메일을 입력해 주세요.');
            return false;
        }

        loading.show();

        const formData = new FormData();
        formData.append('email', emailValue);

        axios.post('/user/sendEmail', formData)
            .then(res => {
                loading.hide();
                if (res.data.result === 'SUCCESS') {
                    $('#salt').val(res.data.salt);
                    $('.email-code-container').addClass('visible');
                    alert('입력하신 이메일로 인증번호가 포함된 메일을 전송하였습니다. 해당 인증번호는 5분간만 유효하니 유의해 주세요.');
                }
                else if (res.data.result === 'FAILURE_DUPLICATE_EMAIL') {
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

        const emailCodeValue = $('#emailCode').val();
        const emailCodeRegex = "^(\\d{6})$";

        if (emailCodeValue === '') {
            alert('인증번호를 입력해 주세요.');
            return false;
        }

        if (!new RegExp(emailCodeRegex).test(emailCodeValue)) {
            alert('올바른 인증번호를 입력해 주세요.');
            return false;
        }

        const formData = new FormData();
        formData.append('email', $('#email').val());
        formData.append('code', emailCodeValue);
        formData.append('salt', $('#salt').val());

        axios.patch('/user/sendEmail', formData)
            .then(res => {
                if (res.data === 'SUCCESS') {
                    alert('인증번호가 정상적으로 확인 되었습니다.');
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


$('#joinForm').submit(function (e) {
    e.preventDefault();

    const formData = $('#joinForm').serialize();

    axios.post('/user/join', formData)
        .then(res => {

        })
        .catch(err => {

        })
})