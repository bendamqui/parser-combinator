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

includesIn = (list) => {
    return (term) => {
        return list.includes(term);
    }
}

module.exports = {
    equalsTo,
    matches,
    includesIn
}