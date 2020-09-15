const queryString = require('query-string');

const newPage = (newPage) => {
    const currentUrl = window.location.href;
    const urlArray = currentUrl.split('?');
    const parsed = queryString.parse("?" + urlArray[1]);

    parsed.page = newPage;

    const newQuery = queryString.stringify(parsed);
    const newUrl = urlArray[0] + '?' + newQuery;

    return newUrl;
}

const newLimit = (newLimit) => {
    const currentUrl = window.location.href;
    const urlArray = currentUrl.split('?');
    const parsed = queryString.parse("?" + urlArray[1]);

    parsed.limit = newLimit;

    const newQuery = queryString.stringify(parsed);
    const newUrl = urlArray[0] + '?' + newQuery;

    return newUrl;
}

module.exports = { newPage, newLimit };