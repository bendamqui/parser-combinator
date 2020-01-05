const {many, satisfy, map, sequence, choice} = require('./../../combinators');
const {char} = require('./../../parsers');
const {includesIn, matches, isDigit, equalsTo} = require('./../../satisfiers');

const rhythm = () => {    
    return map(choice(fraction(), simpleRhythm()), ([numerator, symbol, denominator]) => ({numerator, denominator}));
}

const simpleRhythm = () => {
    return map(number(), numberToFraction);
};

const numberToFraction = (term) => {
    return [term || 1, '/', 1];
}

const number = () => {
    return map(many(digit()), (digits) => digits.join(''));
}

const fraction = () => {
    return sequence(
        number(),
        satisfy(char(), equalsTo('/')),
        number()
    );
}

const digit = () => {
    return satisfy(char(), isDigit)
}

const notes = () => {
    return map(many(note()), (notes) => ({notes}));
}

const note = () => {
    return map(
        sequence(accidentals(), pitch(), rhythm(), octaves()), ([accidentals, pitch, rhythm, octaves]) => ({accidentals, pitch, rhythm, octaves})
    )
}
const accidentals = () => {
    return many(accidental())
}

const octaves = () => {
    return many(octave());
}
const octave = () => {
    return satisfy(char(), includesIn([',', '\'']));
}

const pitch = () => {
    return satisfy(char(), matches(/[a-gA-G]/));
}

const accidental = () => {
    return satisfy(char(), includesIn(['_', '=', '^']))
}

module.exports.parse = (string) => {
    const parser = notes();
    return parser(string);
}