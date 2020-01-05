const {many, satisfy, map, sequence, choice} = require('./../../combinators');
const {char} = require('./../../parsers');
const {includesIn, matches, isDigit, equalsTo} = require('./../../satisfiers');

const staff = () => {
    return many(bar());
}

const bar = () => {
    return map(sequence(
        barItems(),
        barDelimiter()
    ), ([items, barDelimiter]) => {
        items.push(barDelimiter);
        return {
            type: 'bar',
            items
        }        
    })
}

const barDelimiter = () => {
    return choice(repeatBar(), sheetEnd(), barEnd())
}

const barEnd = () => {
    return map(satisfy(char(), equalsTo('|')), () => ({type: 'barEnd'}))
}

const repeatBar = () => {
    return map(sequence(
        satisfy(char(), equalsTo(':')),
        satisfy(char(), equalsTo('|')),
        satisfy(char(), equalsTo('|'))
    ), () => ({type: 'repeatBar'}));
}

const sheetEnd = () => {
    return map(sequence(        
        satisfy(char(), equalsTo('|')),
        satisfy(char(), equalsTo('|'))
    ), () => ({type: 'sheetEnd'}));
}

const barItems = () => {
    return many(choice(note(), chord(), silence()));
}

const silence = () => {
    return map(
        sequence(satisfy(char(), equalsTo('z')),rhythm()),
        ([silence, rhythm]) => ({rhythm, type: 'silence'})
    );
}

const chord = () => {
    return map(sequence(satisfy(char(), equalsTo('[')),many(note()),satisfy(char(), equalsTo(']'))), ([open, notes, close]) => ({notes, type: 'chord'}))
}
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

const note = () => {
    return map(
        sequence(
            accidentals(),
            pitch(),
            rhythm(),
            octaves()
        ), ([accidentals, pitch, rhythm, octaves]) => ({accidentals, pitch, rhythm, octaves, type: 'note'})
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
    return staff()(string);
}