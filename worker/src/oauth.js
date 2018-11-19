export async function checkIfAccessTokenIsValid(accessToken) {
    return (await fetch('https://api.getadministrate.com/graphql', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: '{ hello }'
        }),
    })).ok;
}

export async function generateNewAccessToken(refreshToken) {
    const url = await buildRefreshTokenUrl(refreshToken);

    const resp = await (await fetch(url, {
        method: 'POST'
    })).json();

    return [resp.access_token, resp.refresh_token];
}

async function buildRefreshTokenUrl(refreshToken) {
    const apiKey = await DATABASE.get('apiKey');
    const apiSecret = await DATABASE.get('apiSecret');
    const redirectUri = await DATABASE.get('redirectUri');

    return 'https://auth.getadministrate.com/oauth/token?refresh_token=' + refreshToken +
        '&grant_type=refresh_token&client_id=' + apiKey + '&client_secret=' + apiSecret +
        '&redirect_uri=' + redirectUri;
}