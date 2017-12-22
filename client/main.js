import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Router.route('/', {
    template: "mainLayout"
})

Template.mainLayout.events({
    'click #scheduleBtn': function() {
        Router.go('/eventLayout');
    }
});

Template.mainLayout.events({
    'click #formBtn': function(){
        Router.go('/formLayout');
    }
});
