/**
 * Created by minnieliu on 2017-11-23.
 */
import {PatientRecords} from "/collections/patient-record"
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';



Router.route("formLayout");

Template.formLayout.events({
    'click #backBtn': function(){
    Router.go('/');}
})

if (Meteor.isClient){
    Template.body.helpers({
        resolutions: function() {
            return Resolutions.find(); // finds all records in the collection
        }
    })

  Template.formLayout.events({
    'submit .patient-form' : function(event) {
          console.log("submitting form");
        var legalName = event.target.legalName.value;
        var phn = event.target.phn.value;
        var birthDate = event.target.birthDate.value;
        var visitReason = event.target.visitReason.value;
        var symptomDesc = event.target.symptomDesc.value;
        var symptomBegin = event.target.symptomBegin.value;
        var history = event.target.history.value;
        var allergies = event.target.allergies.value;
        var medication = event.target.medication.value;
        var smoke = event.target.smoke.value;
        var alcohol = event.target.alcohol.value

        if (legalName == ""
            || phn == ""
            || birthDate == ""
            || visitReason == ""
            || symptomDesc == ""
            || symptomBegin == ""
            || allergies == ""
            || medication == ""
            || smoke == ""
            || alcohol == "") {
            swal({
                title: "Submission failed",
                text: "Please fill out all boxes!",
                icon: "error",
            });
            return false;
        }
        else {

            PatientRecords.insert({
                createdAt: new Date(),
                legalName: legalName,
                phn: phn,
                birthDate: birthDate,
                visitReason: visitReason,
                symptomDesc: symptomDesc,
                symptomBegin: symptomBegin,
                history: history,
                allergies: allergies,
                medication: medication,
                smoke: smoke,
                alcohol: alcohol
            });
            // setting the value to blank and prevent pg from refreshing
            event.target.legalName.value = "";
            event.target.phn.value = "";
            event.target.birthDate.value = "";
            event.target.visitReason.value = "";
            event.target.symptomDesc.value = "";
            event.target.symptomBegin.value = "";
            event.target.history.value = "";
            event.target.allergies.value = "";
            event.target.medication.value = "";
            event.target.smoke.value = "";
            event.target.alcohol.value = "";
            swal({
                title: "Thank you!",
                text: "We received your submission.",
                icon: "success",
            });
            return false;
        }
    }
  });
}


if (Meteor.isServer){
    Meteor.startup(function() {
        // code to run on server at startup
    })
}