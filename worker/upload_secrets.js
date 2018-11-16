const axios = require('axios');
const config = require('./config.json');
const assert = require('assert');

const cloudflare = axios.create({
    baseURL: 'https://api.cloudflare.com/client/v4',
    headers: {
        'X-Auth-Email': process.env.CLOUDFLARE_AUTH_EMAIL,
        'X-Auth-Key': process.env.CLOUDFLARE_AUTH_KEY
    }
});

try {
    cloudflare.put('/accounts/' + config.accountId + '/storage/kv/namespaces/' + config.namespaceId + '/values/apiKey', config.administate.apiKey).then((resp) => {
        assert(resp.data.success);
        console.log('Administrate API Key Set!');
    });
} catch {
    console.error('Could not set Administrate API Key!');
}

try {
    cloudflare.put('/accounts/' + config.accountId + '/storage/kv/namespaces/' + config.namespaceId + '/values/apiSecret', config.administate.apiSecret).then((resp) => {
        assert(resp.data.success);
        console.log('Administrate API Secret Set!');
    });
} catch {
    console.error('Could not set Administrate API Secret!');
}

try {
    cloudflare.put('/accounts/' + config.accountId + '/storage/kv/namespaces/' + config.namespaceId + '/values/redirectUri', config.administate.redirectUri).then((resp) => {
        assert(resp.data.success);
        console.log('Administrate Redirect URI Set!');
    });
} catch {
    console.error('Could not set Administrate Redirect URI!');
}

try {
    cloudflare.put('/accounts/' + config.accountId + '/storage/kv/namespaces/' + config.namespaceId + '/values/accessToken', config.administate.accessToken).then((resp) => {
        assert(resp.data.success);
        console.log('Administrate Access Token Set!');
    });
} catch {
    console.error('Could not set Administrate Access Token!');
}

try {
    cloudflare.put('/accounts/' + config.accountId + '/storage/kv/namespaces/' + config.namespaceId + '/values/refreshToken', config.administate.refreshToken).then((resp) => {
        assert(resp.data.success);
        console.log('Administrate Refresh Token Set!');
    });
} catch {
    console.error('Could not set Administrate Refresh Token!');
}