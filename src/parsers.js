const {error, ok} = require('./symbols');

const char = () => {
    return (input) => {
        switch(input[0]) {
            case undefined:
                return [error];            
            default:                
                return  [ok, input[0], input.slice(1)];
        }
    }    
}

module.exports = {
    char
}