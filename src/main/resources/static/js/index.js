var calendarEl = $('#calendar')[0];
var calendar = new FullCalendar.Calendar(calendarEl, {
    height: '700px',
    expandRows: true,
    initialView: 'dayGridMonth',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },

    events: [
        {
          title  : 'event1',
          start  : '2024-03-07'
        },
        {
          title  : 'event2',
          start  : '2024-03-08',
          end    : '2010-03-09'
        },
        {
          title  : 'event3',
          start  : '2010-03-11T12:30:00',
          allDay : false // will make the time show
        }
      ]
    });
calendar.render();