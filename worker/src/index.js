import handleCoursesRequest from './courses';
import handleCourses2Request from './courses';

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
            event.respondWith(handleCourses2Request(request));
            break;
        default:
            event.respondWith(handleNormalRequest(request));
    }
});