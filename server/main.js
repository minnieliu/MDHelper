import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import {PatientRecords} from "/collections/patient-record"
//import '/private/html-email.html';







Meteor.startup(() => {
    process.env.MAIL_URL = "smtp://postmaster%40sandbox1551f43a07ce426e9c0b514db0e838ae.mailgun.org:263f40acf6fe249364ebc6d494d46614@smtp.mailgun.org:587"
    SyncedCron.start();

})
;
SyncedCron.add({
    name: "Daily Emails",
    schedule: function(parser){
        //return parser.text("every 1 minutes");
        return parser.text('at 1:00 am');
    },
    job: function(){  Meteor.call("send_email")}
})

Meteor.methods({
    send_email: function(){
        console.log("got to send email function!")
        var date = new Date();
        var begun = moment(date).format('MM/DD/YYYY');
        Meteor.call("emailPatientRecords", begun);
        return true;
    },

    emailPatientRecords: function(curDate){

        var foundRecords = PatientRecords.find({"aptTime": curDate}).fetch();
        var renderedHtml = "";
        SSR.compileTemplate('htmlEmail',Assets.getText('html-email.html'));
        for (i = 0; i < foundRecords.length; i++){
            console.log(foundRecords[i].phn);
            var emailData = {
                name: foundRecords[i].legalName,
                phn: foundRecords[i].phn,
                aptTime: foundRecords[i].aptTime,
                birthDate: foundRecords[i].birthDate,
                visitReason: foundRecords[i].visitReason,
                symptomDesc: foundRecords[i].symptomDesc,
                symptomBegin: foundRecords[i].symptomBegin,
                history: foundRecords[i].history,
                allergies: foundRecords[i].allergies,
                medication: foundRecords[i].medication,
                smoke: foundRecords[i].smoke,
                alcohol: foundRecords[i].alcohol
            };
            renderedHtml += SSR.render('htmlEmail', emailData);
        }
        // console.log("ssrRender: " + SSR.render('htmlEmail', emailData));
        Email.send({
            to: "minnieliu96@yahoo.ca",
            from: "minnieliu96@hotmail.com",
            subject: "test",
            html: renderedHtml,
        });
        console.log("email sent")
    }
})