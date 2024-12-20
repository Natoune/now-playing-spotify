import { i18n } from "$lib/i18n";
import {
	type AvailableLanguageTag,
	availableLanguageTags,
} from "$lib/paraglide/runtime";

export function redirect(location: string): void {
	const url = new URL(location, window.location.origin);
	if (url.origin !== window.location.origin) {
		window.location.href = url.toString();
	} else if (url.pathname.startsWith("/")) {
		const languageUrl = availableLanguageTags.includes(
			window.location.pathname.slice(1, 3) as AvailableLanguageTag,
		)
			? i18n.getLanguageFromUrl(new URL(window.location.href))
			: undefined;
		const languageNavigator = navigator.language.slice(0, 2);

		const language = languageUrl || languageNavigator;
		const pathWithLanguage = i18n.resolveRoute(
			`${url.pathname}${url.search}${url.hash}`,
			language as AvailableLanguageTag,
		);

		window.location.href = pathWithLanguage;
	} else {
		throw new Error(`Invalid URL: ${url}`);
	}
}
