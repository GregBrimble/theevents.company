import Mustache from 'mustache';
import axios from 'axios';

export default async function handleCoursesRequest(request) {
    const resp = await fetch(request);
    const text = await resp.text();

    const apiKey = await DATABASE.get('apiKey');
    const apiSecret = await DATABASE.get('apiSecret');
    const redirectUri = await DATABASE.get('redirectUri');
    const accessToken = await DATABASE.get('accessToken');
    const refreshToken = await DATABASE.get('refreshToken');

    var view = {
        catalogue: 'Catalogue here!',
        calendar: 'Calendar here!',
        checkout: 'Checkout here!',
        lms: 'LMS Access here!'
    };

    return new Response(Mustache.render(text, view), {
        headers: {
            'Content-Type': 'text/html'
        }
    });
}