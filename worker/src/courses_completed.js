import Mustache from 'mustache';
import {checkIfAccessTokenIsValid, generateNewAccessToken} from './oauth';
import {debug} from '../utils';


async function makeGraphQLAPIQuery(accessToken, query) {
    return await (await fetch('https://api.getadministrate.com/graphql', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: query
        }),
    })).json();
}


export default async function handleCoursesCompletedRequest(request) {
    const resp = await fetch(request);
    const text = await resp.text();

    let accessToken = await DATABASE.get('accessToken');
    const isValid = await checkIfAccessTokenIsValid(accessToken);

    if (!isValid) {
        let refreshToken = await DATABASE.get('refreshToken');

        [accessToken, refreshToken] = await generateNewAccessToken(refreshToken);

        DATABASE.put('accessToken', accessToken);
        DATABASE.put('refreshToken', refreshToken);
    }

    const graphQLResponse = await makeGraphQLAPIQuery(accessToken, '{hello}');

    var view = {
        catalogue: 'Catalogue here!',
        calendar: 'Calendar here!',
        checkout: 'Checkout here!',
        lms: 'LMS Access here!',
        debug: debug(graphQLResponse)
    };

    return new Response(Mustache.render(text, view), {
        headers: {
            'Content-Type': 'text/html'
        }
    });
}