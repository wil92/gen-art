import {hash} from "../src/libs/utils/hash";

describe('getRandBySeed', () => {
  it('should check hash function', () => {
    expect(hash('asldkfjalskdf asdlkf j')).toEqual(516162693);
    expect(hash('asldkfjalskdf asdlkf j sdfgsd gsdf')).toEqual(1453231298);
  });
});
