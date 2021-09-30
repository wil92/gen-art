const main = require('./main')

describe('main', () => {
  it('should check hash function', () => {
    expect(main.hash('asldkfjalskdf asdlkf j')).toEqual(345858460);
    expect(main.hash('asldkfjalskdf asdlkf j sdfgsd gsdf')).toEqual(449888824);
  });

  it('should check pow function', () => {
    expect(main.pow(2, 2)).toEqual(4);
    expect(main.pow(2, 3, 7)).toEqual(1);
    expect(main.pow(2, 5, 31)).toEqual(1);
  });

  it('should check getRandBySeed function', () => {
    expect(main.getRandBySeed('asdf sadf sd')()).toEqual(0.12913707649760744);
    expect(main.getRandBySeed('asdf sadf sd', 'asdfa')()).toEqual(0.25264310848556604);
  });

});
