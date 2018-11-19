import {calendar, catalogue, debug, fetchCourseCodeFromButton, renderPage} from './utils';
import {checkIfAccessTokenIsValid, generateNewAccessToken} from './oauth';

const allInfoQuery = `
query ($includeEvents: Boolean!, $courseTemplateCode: String) {
  events(filters: [{field: courseTemplateCode, operation: eq, value: $courseTemplateCode}, {field: isSoldOut, operation: ne, value: "true"}, {field: status, operation: eq, value: "Active"}, {field: start, operation: gt, value: "2018-11-16T00:00:00"}, {field: type, operation: eq, value: "public"}], order: {direction: asc, field: start}) @include(if: $includeEvents) {
    edges {
      node {
        id
        title
        start
        end
        remainingPlaces
        interested
        learningMode
        location {
          name
        }
        reserved
        defaultPrice {
          amount
          financialUnit {
            name
          }
        }
        defaultTaxType {
          effectiveRate
          name
        }
        region {
          name
        }
        sessions {
          edges {
            node {
              start
              end
            }
          }
        }
      }
    }
  }
  courseTemplateCustomFields: customFieldTemplate(type: CourseTemplate) {
    customFieldDefinitions {
      key
      label
    }
  }
  courseTemplates(filters: [{field: lifecycleState, operation: eq, value: "published"}]) {
    edges {
      node {
        code
        title
        lmsSummary
        customFieldValues {
          value
          definitionKey
        }
      }
    }
  }
}`;


async function makeGraphQLAPIQuery(accessToken, body) {
    return await (await fetch('https://api.getadministrate.com/graphql', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    })).json();
}

export default async function handleCoursesRequest(request) {

    // Fetch values from database
    let apiKey = await DATABASE.get('apiKey');
    let apiSecret = await DATABASE.get('apiSecret');
    let redirectUri = await DATABASE.get('redirectUri');
    let accessToken = await DATABASE.get('accessToken');
    let refreshToken = await DATABASE.get('refreshToken');

    const isValid = await checkIfAccessTokenIsValid(accessToken);
    if (!isValid) {
        [accessToken, refreshToken] = await generateNewAccessToken(refreshToken);

        DATABASE.put('accessToken', accessToken);
        DATABASE.put('refreshToken', refreshToken);
    }

    const courseCode = fetchCourseCodeFromButton(request);

    const graphqQLResponse = await makeGraphQLAPIQuery(accessToken, {
        query: allInfoQuery,
        variables: {
            courseTemplateCode: courseCode,
            includeEvents: courseCode !== null
        }
    });

    const view = {
        catalogue: await catalogue(graphqQLResponse),
        calendar: await calendar(graphqQLResponse),
        checkout: 'Checkout here!',
        lms: 'LMS Access here!',
        debug: await debug(graphqQLResponse)
    };

    return await renderPage(request, view);
}