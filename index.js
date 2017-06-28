/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const Fuse = require('fuse.js');
const Alexa = require('alexa-sdk');
const fs = require('fs');
const path = require('path');

const APP_ID = 'amzn1.ask.skill.1e4f454b-6824-44a1-9665-cf8e2a43b69f';

const handlers = {
  'GetExerciseInfo': function() {
    const user = this.event.session.user.userId,
      userExercise = this.event.request.intent.slots.exercise.value,
      normalizedExercise = normalizeExercise(userExercise);

    var item = this.attributes[uniqueIdentifier(user, normalizedExercise)];

    if (typeof item !== 'undefined') {
      this.emit(':tell', tellAboutExercise(item.exercise, item.weight, item.reps));
    } else {
      this.emit(':tell', 'Workout bro says do you even ' + userExercise + ' bro? You have\'t told me what you ' + userExercise);
    }
  },

  'SetExerciseInfo': function() {
    const slots = this.event.request.intent.slots,
      user = this.event.session.user.userId,
      userExercise = this.event.request.intent.slots.exercise.value,
      normalizedExercise = normalizeExercise(userExercise);

    this.attributes[uniqueIdentifier(user, normalizedExercise)] = {
      exercise: normalizedExercise,
      weight: slots.weight.value,
      reps: slots.reps.value
    };

    if (typeof normalizedExercise !== 'undefined') {
      this.emit(':tell', tellAboutExercise(normalizedExercise, slots.weight.value, slots.reps.value));
    } else {
      this.emit(':tell', "Seriously broseidon, what is " + userExercise + " I haven't heard of that before. I'll take note and add that as an exercise soon bro.");
      console.warn("Exercise not found we should add " + userExercise);
    }
  },
};

/**
 * Helpers
 **/
var normalizeExercise = function(exercise) {
  const list = fs.readFileSync(path.join(__dirname, 'exercises.txt')).toString().split('\n');
  const fuse = new Fuse(list, {});

  var index = fuse.search(exercise);
  var normalizedExercise = list[index[0]];

  console.info("Normalized " + exercise + " to " + normalizedExercise);

  return normalizedExercise
}

var tellAboutExercise = function(exercise, weight, reps) {
  if (typeof reps !== 'undefined' && typeof weight !== 'undefined') {
    return 'You ' + exercise + ' ' + weight + ' pounds for ' + reps + ' reps';
  } else if (typeof weight !== 'undefined') {
    return 'You ' + exercise + ' ' + weight + ' pounds';
  } else {
    return 'You ' + exercise + ' ' + reps + ' reps';
  }
}

var uniqueIdentifier = function(user, exercise) {
  return user + ':' + exercise;
}

module.exports = {
  handler: function(event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.locale = 'en-US';
    alexa.dynamoDBTableName = 'MyWorkoutBro';
    alexa.registerHandlers(handlers);
    alexa.execute();
  },
  normalizeExercise: normalizeExercise,
  tellAboutExercise: tellAboutExercise,
  uniqueIdentifier: uniqueIdentifier
}