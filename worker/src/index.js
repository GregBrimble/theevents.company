import handleCoursesRequest from './courses';
import handleCoursesCompletedRequest from './courses_completed';

async function handleNormalRequest(request) {
    return await fetch(request);
}

addEventListener('fetch', event => {
    const request = event.request;
    const pathname = (new URL(request.url)).pathname;
    switch (pathname) {
        case '/courses.html':
            event.respondWith(handleCoursesRequest(request));
            break;
        case '/courses2.html':
            event.respondWith(handleCoursesCompletedRequest(request));
            break;
        default:
            event.respondWith(handleNormalRequest(request));
    }
});