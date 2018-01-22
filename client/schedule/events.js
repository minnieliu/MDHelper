import {Appointments} from "/collections/appointments"
Router.route('/eventLayout');

Template.body.rendered = function () {
    var fc = this.$('.fc');
    this.autorun(function () {
        //1) trigger event re-rendering when the collection is changed in any way
        //2) find all, because we've already subscribed to a specific range
        Appointments.find();
        fc.fullCalendar('refetchEvents');
    });
};

Template.eventLayout.events({
    'click #backBtn': function(){
        Router.go('/')
        $(window).scrollTop(0);
        this.next();},
    'click #formBtn' : function(){
        Router.go('/formLayout')
        $(window).scrollTop(0);
        this.next();
    }
})


Template.eventLayout.onRendered(() =>{
    $( '#events-calendar' ).fullCalendar({
        events( start, end, timezone, callback ) {
            let data = Appointments.find().fetch().map( ( event ) => {
                event.editable = !isPast( event.start );
                return event;
            });

            if ( data ) {
                callback( data );
            }
        },
        dayClick( date ) {
            Session.set( 'eventModal', { type: 'add', date: date.format() } );
            Modal.show('addEditEventModal');
        },
        eventClick( event ) {
            Session.set( 'eventModal', { type: 'edit', event: event._id } );
            $( '#add-edit-event-modal' ).modal( 'show' );
        }

    });

    Tracker.autorun( () => {
        Appointments.find().fetch();
        $( '#events-calendar' ).fullCalendar( 'refetchEvents' );
    });
});

Template.eventLayout.onCreated( () => {
    let template = Template.instance();
    template.subscribe( 'appointments' );
});

let isPast = (date) => {
    let today =moment().format();
    return moment(today).isAfter(date);
}


Template.addEditEventModal.events({

    'click #save': function(e) {
        e.preventDefault();

        var firstName    =  $('#firstName').val()
        var lastName     =  $('#lastName').val()
        var startDate    =  $('#start').val()
        var startHour    = $('#hour').val()
        var startMin     = $('#minute').val()
        var type         = $('#type').val()
        console.log("got here")
        if (firstName == ""
            || lastName == ""
            || startDate == ""
            || startHour == ""
            || startMin == ""
            || type == ""
        ) {
            swal({
                title: "Submission failed",
                text: "Please fill out all boxes!",
                icon: "error",
            });
            return false;
        }

        var aptTime = startDate + startHour + ":" + startMin;
        if (Appointments.findOne({ aptTime: aptTime}) != null){
            swal({
                title: "Submission failed",
                text: "Time Unavaliable, please select a different time!",
                icon: "error",
            });
        }
            else {
            Appointments.insert({
                createdAt: new Date(),
                legalName: lastName + "," + firstName,
                aptTime: startDate + startHour + ":" + startMin,
                aptType: type
            });
            // setting the value to blank and prevent pg from refreshing

            swal({
                title: "Thank you!",
                text: "We received your submission.",
                icon: "success",
            });
            return false;
        }
    }
})
