const {many, satisfy, map, sequence} = require('./../../combinators');
const {char} = require('./../../parsers');
const {includesIn, matches} = require('./../../satisfiers');

const notes = () => {
    return map(many(note()), (notes) => ({notes}));
}
const note = () => {
    return map(sequence(accidentals(), pitch(), octaves()), ([accidentals, pitch, octaves]) => ({accidentals, pitch, octaves}))
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