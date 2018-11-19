import {calendar, catalogue, debug, fetchCourseCodeFromButton, renderPage} from './utils';
import {checkIfAccessTokenIsValid, generateNewAccessToken} from './oauth';

export default async function handleCoursesRequest(request) {

    // Fetch values from database
    let apiKey = await DATABASE.get('apiKey');
    let apiSecret = await DATABASE.get('apiSecret');
    let redirectUri = await DATABASE.get('redirectUri');
    let accessToken = await DATABASE.get('accessToken');
    let refreshToken = await DATABASE.get('refreshToken');

    const view = {
        catalogue: 'Catalogue here!',
        calendar: 'Calendar here!',
        checkout: 'Checkout here!',
        lms: 'LMS Access here!',
        debug: await debug('Debug here!')
    };

    return await renderPage(request, view);
}