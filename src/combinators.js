/**
 * @todo delimited list
 * @todo skip white spaces (token?).
 */

const {error, ok} = require('./symbols');

const satisfy = (parser, rule) => {
    return (input) => {
        const [result, term, rest] = parser(input);    
        switch (result) {
            case ok:
                return rule(term) ? [ok, term, rest] : [error];
            default:
                return [error];
        }
    }
};

const many = (parser) => {
    return (input) => {
        const [result, term, rest] = parser(input);                
        switch (result) {
            case error:                
                return [ok, [], input]
            case ok:                                
                const [other_result, other_term, other_rest] = many(parser)(rest);                
                return [ok, [...[term], ...other_term], other_rest];
        }
    }
};

const choice = (...parsers) => {
    return (input) => {
        if (parsers.length === 0) {
            return [error]
        }        
        // const ? and use shift instead of filter?
        [result, term, rest] = parsers[0](input);
        switch(result) {
            case ok:
                return [result, term, rest];
            case error:                
                return choice(...parsers.filter((value, index) => index !== 0))(input);
            default:
                return [error];
        }
    }
}

const sequence = (...parsers) => {
    return (input) => {
        switch(parsers.length) {
            case 0:
                return [ok, [], input];
            default:
                const [result, term, rest] = parsers[0](input);
                switch(result) {
                    case ok:
                        const [other_result, other_term, other_rest] = sequence(...shift(parsers))(rest);                        
                        switch(other_result){
                            case ok:
                                return [ok, [...[term], ...other_term], other_rest];
                            default:
                                return [error]    
                        }                        
                    default:
                        return [error];
                }
        }
    }
}

const map = (parser, fn) => {
    return (input) => {
        const [result, term, rest] = parser(input);
        switch(result) {
            case ok:
                return [ok, fn(term), rest];
            default:
                return [result, term, rest]
        }
    }
}

const shift = (array) => {
    return array.filter((value, index) => index !== 0);
}

module.exports = {    
    satisfy,
    many,
    choice,
    sequence,
    map
}