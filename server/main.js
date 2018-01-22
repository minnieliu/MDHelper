import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email'

Meteor.startup(() => {
    process.env.MAIL_URL = "smtp://postmaster%40sandbox1551f43a07ce426e9c0b514db0e838ae.mailgun.org:263f40acf6fe249364ebc6d494d46614@smtp.mailgun.org:587"
    SyncedCron.start();

    
})
;
SyncedCron.add({
    name: "Daily Emails",
    schedule: function(parser){
        return parser.text('at 1:00 am');
    },
    job: function(){  Meteor.call("send_email")}
})

Meteor.methods({
    send_email: function(){
        console.log("got to send email function!")
        Email.send({
            to: "minnieliu96@yahoo.ca",
            from: "minnieliu96@hotmail.com",
            subject: "Test",
            text: "Test email for MDHelper.",
        });
        console.log("email sent")
        return true;
    }
})