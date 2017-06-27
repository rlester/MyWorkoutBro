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
    const self = this,
      user = this.event.session.user.userId,
      exercise = normalizeExercise(this.event.request.intent.slots.exercise.value);

    var item = this.attributes[uniqueIdentifier(user, exercise)];

    self.emit(':tell', tellAboutExercise(item.exercise, item.weight, item.reps));
  },

  'SetExerciseInfo': function() {
    const self = this,
      slots = this.event.request.intent.slots,
      user = this.event.session.user.userId,
      exercise = normalizeExercise(this.event.request.intent.slots.exercise.value);

    this.attributes[uniqueIdentifier(user, exercise)] = {
      exercise: slots.exercise.value,
      weight: slots.weight.value,
      reps: slots.reps.value
    };

    self.emit(':tell', tellAboutExercise(exercise, slots.weight.value, slots.reps.value));
  },
};

exports.handler = function(event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.locale = 'en-US';
  alexa.dynamoDBTableName = 'MyWorkoutBro';
  alexa.registerHandlers(handlers);
  alexa.execute();
};

/**
 * Helpers
 **/

function normalizeExercise(exercise) {
  const list = fs.readFileSync(path.join(__dirname, 'exercises.txt')).toString().split('\n');
  const fuse = new Fuse(list,  {});

  var index = fuse.search(exercise);
  return list[index];
}

function tellAboutExercise(exercise, weight, reps) {
  if (typeof reps !== 'undefined') {
    return 'You ' + exercise + ' ' + weight + ' pounds for ' + reps + ' reps';
  } else {
    return 'You ' + exercise + ' ' + weight + ' pounds';
  }
}

function uniqueIdentifier(user, exercise) {
  return user + ':' + exercise;
}
