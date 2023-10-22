
document.addEventListener('DOMContentLoaded', function () {
    var initialLocalesCode = 'ko';
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        windowResize: function (arg) { },
        contentHeight: 656,
        initialView: 'dayGridMonth',
        editable: true,
        selectable: true,
        navLinks: true,
        selectMirror: true,
        dayMaxEvents: true,
        headerToolbar: {
            left: 'prev,today,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
        },
        locale: initialLocalesCode,
        googleCalendarApiKey: 'AIzaSyD81ehkYsF5rpz8H9KWTz1L23qOynMCG50',
        events: {
            googleCalendarId: '146993739462bc740346f2deff54727800144d70bfaca0584601470e5a136353@group.calendar.google.com',
            className: 'gcal-event' // an option!
        },
        // Create new event
        select: function (arg) {
            Swal.fire({
                html: '<div class="mb- 7">새 일정을 추가하시겠습니까?</div><div class="fw - bolder mb - 5">일정 제목:</div><input type="text" class="form - control" name="event_name"/>',

                icon: "info",
                showCancelButton: true,
                buttonsStyling: true,
                confirmButtonText: "일정 추가",
                cancelButtonText: "취소",
                cancelButtonColor: "#d33",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    var title = document.querySelector('input[name="event_name"]').value;
                    if (title) {
                        calendar.addEvent({
                            title: title,
                            start: arg.start,
                            end: arg.end,
                            allDay: arg.allDay
                        })
                    }
                    calendar.unselect()
                } else if (result.dismiss === "cancel") {
                    Swal.fire({
                        text: "일정 생성 취소됨.",
                        icon: "error",
                        buttonsStyling: true,
                        confirmButtonText: "확인",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
        },

        // Delete event
        eventClick: function (arg) {
            
            Swal.fire({
                text: "이 일정을 삭제하시겠습니까?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: true,
                confirmButtonText: "삭제",
                confirmButtonColor: "#d33",
                cancelButtonText: "취소",
                customClass: {
                    confirmButton: "btn btn-primary",
                    cancelButton: "btn btn-active-light"
                }
            }).then(function (result) {
                if (result.value) {
                    arg.event.remove()
                } else if (result.dismiss === "cancel") {
                    Swal.fire({
                        text: "일정 삭제 취소.",
                        icon: "error",
                        buttonsStyling: true,
                        confirmButtonText: "확인",
                        customClass: {
                            confirmButton: "btn btn-primary",
                        }
                    });
                }
            });
        },



    });
    calendar.render();
});
