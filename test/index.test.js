var chai = require('chai')
var index = require('../index')

console.log(index)

describe('uniqueIdentifier', () => {
  it('should construct a unique identifier', () => {
    chai.expect(index.uniqueIdentifier('amzn1.ask.account.AFIAWKT5YFTE', 'squat')).to.equal('amzn1.ask.account.AFIAWKT5YFTE:squat');
  });
});

describe('tellAboutExercise', () => {
  it('should construct a string with weight and reps', () => {
    chai.expect(index.tellAboutExercise('squat', '255', '12')).to.equal('You squat 255 pounds for 12 reps');
  });

  it('should construct a string with a weight and no reps', () => {
    chai.expect(index.tellAboutExercise('squat', '255')).to.equal('You squat 255 pounds');
  });
});

describe('normalizeExercise', () => {
  it('should normalize squatted to squat', () => {
    chai.expect(index.normalizeExercise('squatted')).to.equal('squat');
  });

  it('should normalize bicep curled to bicep curl', () => {
    chai.expect(index.normalizeExercise('bicep curled')).to.equal('bicep curl');
  });

  it('should normalize benched to bench press', () => {
    chai.expect(index.normalizeExercise('benchedd')).to.equal('bench press');
  });
});
