import { apiCall } from '$lib/api.js';
import { loadConfig } from '$lib/config.js';

export async function load({ fetch, cookies }) {

    const sessionId = cookies.get('evermeet-session-id');
    let user = null;
    if (sessionId) {
        const resp = await apiCall(fetch, 'me', {
            headers: {
                'evermeet-session-id': sessionId
            }
        })
        user = resp.user;
    }

    const config = await loadConfig();

    return {
        sessionId,
        user,
        config
    }
}