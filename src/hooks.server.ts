import { i18n } from "$lib/i18n";
import {
	type AvailableLanguageTag,
	availableLanguageTags,
} from "$lib/paraglide/runtime";
import { sequence } from "@sveltejs/kit/hooks";

export async function handle({ event, resolve }) {
	const url = new URL(event.request.url);
	if (
		!availableLanguageTags.includes(
			url.pathname.slice(1, 3) as AvailableLanguageTag,
		)
	) {
		const languageParam = url.searchParams.get("state") as
			| AvailableLanguageTag
			| undefined;
		const languageHeader = event.request.headers
			.get("accept-language")
			?.split(",")[0] as AvailableLanguageTag | undefined;

		url.searchParams.delete("state");

		const language =
			languageParam || languageHeader || i18n.config.defaultLanguageTag;
		const localisedPath = i18n.strategy.getLocalisedPath(
			`${url.pathname}${url.search}${url.hash}`,
			language,
		);

		return new Response(null, {
			status: 302,
			headers: {
				Location: localisedPath,
			},
		});
	}

	return sequence(i18n.handle())({ event, resolve });
}
