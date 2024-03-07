const scheduleAdd = () => {
    $('#scheduleAdd').addClass('visible');
}

$('#scheduleAdd').on({
    'click': function () {
        $('#scheduleAdd').removeClass('visible');
    }
})