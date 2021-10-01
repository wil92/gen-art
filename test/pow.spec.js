import {pow} from "../src/libs/utils/functions";

describe('getRandBySeed', () => {
  it('should check pow function', () => {
    expect(pow(2, 2)).toEqual(4);
    expect(pow(2, 3, 7)).toEqual(1);
    expect(pow(2, 5, 31)).toEqual(1);
  });
});
