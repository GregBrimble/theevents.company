import Mustache from 'mustache';

export function fetchCourseCodeFromButton(request) {
    return new URL(request.url).searchParams.get('course');
}

export async function debug(obj) {
    try {
        return '<pre class="prettyprint lang-json">' + JSON.stringify(obj, null, 4) + '</pre>';
    } catch (err) {
        return err.message;
    }
}

function hydrateCustomFieldValues(customFieldValues, customFieldDefinitions) {
    return customFieldValues.map(customFieldValue => {
        customFieldValue.label = customFieldDefinitions.find(customFieldDefinition => customFieldValue.definitionKey === customFieldDefinition.key).label;
        return customFieldValue;
    });
}

export async function catalogue(resp) {
    try {
        const data = resp.data;
        const template = await (await fetch('https://theevents.company/catalogue.html')).text();

        let courseTemplates = data.courseTemplates.edges.map(edge => edge.node);
        let customFieldDefinitions = data.courseTemplateCustomFields.customFieldDefinitions;
        courseTemplates = courseTemplates.map(courseTemplate => {
            courseTemplate.customFieldValues = hydrateCustomFieldValues(courseTemplate.customFieldValues, customFieldDefinitions);
            return courseTemplate;
        });

        return Mustache.render(template, {
            courseTemplates: courseTemplates
        });
    } catch (err) {
        return err.message;
    }
}

export async function calendar(resp) {
    try {
        const data = resp.data;
        const template = await (await fetch('https://theevents.company/calendar.html')).text();

        if (data.events === undefined) {
            return '<p>Select a Course from above!</p>';
        } else {
            let events = data.events.edges.map(edge => edge.node);

            return Mustache.render(template, {
                events: events
            });
        }
    } catch (err) {
        return err.message;
    }
}

export async function renderPage(request, view) {
    const resp = await fetch(request);
    const text = await resp.text();

    return new Response(Mustache.render(text, view), {
        headers: {
            'Content-Type': 'text/html'
        }
    });
}