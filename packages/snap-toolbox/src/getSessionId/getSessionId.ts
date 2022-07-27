import { cookies, getFlags } from '../index';
import { v4 as uuidv4 } from 'uuid';

const COOKIE_SAMESITE = 'Lax';
export const PAGELOADID_STORAGE_NAME = 'ssPageLoadIdNamespace';

export function getSessionId(key: string = 'ssSessionIdNamespace', freshStart?: boolean): string | undefined {
	let sessionId;
	if (getFlags().storage()) {
		try {
			sessionId = !freshStart ? sessionStorage.getItem(key) || uuidv4() : uuidv4();
			sessionStorage.setItem(key, sessionId);
			getFlags().cookies() && cookies.set(key, sessionId, COOKIE_SAMESITE, 0); //session cookie
		} catch (e) {
			console.error(`Failed to get ${key} from session storage:`, e);
		}
	} else if (getFlags().cookies()) {
		// use cookies if sessionStorage is not enabled and only reset cookie if new session to keep expiration
		sessionId = cookies.get(key);
		if (freshStart || !sessionId) {
			sessionId = uuidv4();
		}
		cookies.set(key, sessionId, COOKIE_SAMESITE, 0);
	}

	return sessionId;
}
