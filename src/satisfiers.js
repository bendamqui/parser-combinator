const equalsTo = (value) => {
    return (term) => {        
        return term === value;
    }
}

const matches = (match) => {
    return (char) => {
        return match.test(char);
    }
}

const includesIn = (list) => {
    return (term) => {
        return list.includes(term);
    }
}

const isDigit = (term) => {
    return matches(/[0-9]/)(term);
}

module.exports = {
    equalsTo,
    matches,
    includesIn,
    isDigit
}