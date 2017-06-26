/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

import Fuse from 'fuse.js';
import Alexa from 'alexa-sdk';
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

const docClient = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1'
});

const APP_ID = 'amzn1.ask.skill.1e4f454b-6824-44a1-9665-cf8e2a43b69f';

const handlers = {
  'GetExerciseInfo': function() {
    const self = this,
      user = this.event.session.user.userId,
      exercise = normalizeExercise(this.event.request.intent.slots.exercise.value);

    let params = {
      TableName: 'MyWorkoutBro',
      Key: {
        id: uniqueIdentifier(user, exercise),
      }
    };

    docClient.get(params, function(err, data) {
      if (err) {
        console.error('Unable to read item. Error JSON:', JSON.stringify(err, null, 2));
      } else {
        var item = data.Item;
        self.emit(':tell', tellAboutExercise(item.exercise, item.weight, item.reps));
      }
    });
  },

  'SetExerciseInfo': function() {
    const self = this,
      slots = this.event.request.intent.slots,
      user = this.event.session.user.userId,
      exercise = normalizeExercise(this.event.request.intent.slots.exercise.value);

    var params = {
      Item: {
        id: uniqueIdentifier(user, exercise),
        exercise: slots.exercise.value,
        weight: slots.weight.value,
        reps: slots.reps.value
      },

      TableName: 'MyWorkoutBro'
    };

    docClient.put(params, function(error, data) {
      if (error) {
        console.log(error);
      } else {
        var item = data.Item;
        self.emit(':tell', tellAboutExercise(item.exercise, item.weight, item.reps));
      }
    });
  },
};

exports.handler = function(event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

/**
 * Helpers
 **/

export function normalizeExercise(exercise) {
  const list = fs.readFileSync(path.join(__dirname, 'exercises.txt')).toString().split('\n');
  const fuse = new Fuse(list,  {});

  var index = fuse.search(exercise);
  return list[index];
}

export function tellAboutExercise(exercise, weight, reps) {
  if (typeof reps !== 'undefined') {
    return 'You ' + exercise + ' ' + weight + ' pounds for ' + reps + ' reps';
  } else {
    return 'You ' + exercise + ' ' + weight + ' pounds';
  }
}

export function uniqueIdentifier(user, exercise) {
  return user + ':' + exercise;
}
