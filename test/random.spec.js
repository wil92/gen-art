import {getRandBySeed} from "../src/libs/utils/random";

describe('getRandBySeed', () => {
  it('should check getRandBySeed function', () => {
    expect(getRandBySeed('asdf sadf sd')()).toEqual(0.8448480595112071);
    expect(getRandBySeed('asdf sadf sd', 'asdfa')()).toEqual(0.785362079639622);
  });
});
