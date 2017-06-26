import { expect } from 'chai';

import {
  tellAboutExercise,
  uniqueIdentifier,
  normalizeExercise
} from '../src';

describe('uniqueIdentifier', () => {
  it('should construct a unique identifier', () => {
    expect(uniqueIdentifier('amzn1.ask.account.AFIAWKT5YFTE', 'squat')).to.equal('amzn1.ask.account.AFIAWKT5YFTE:squat');
  });
});

describe('tellAboutExercise', () => {
  it('should construct a string with weight and reps', () => {
    expect(tellAboutExercise('squat', '255', '12')).to.equal('You squat 255 pounds for 12 reps');
  });

  it('should construct a string with a weight and no reps', () => {
    expect(tellAboutExercise('squat', '255')).to.equal('You squat 255 pounds');
  });
});

describe('normalizeExercise', () => {
  it('should normalize squatted to squat', () => {
    expect(normalizeExercise('squatted')).to.equal('squat');
  });

  it('should normalize bicep curled to bicep curl', () => {
    expect(normalizeExercise('bicep curled')).to.equal('bicep curl');
  });
});
