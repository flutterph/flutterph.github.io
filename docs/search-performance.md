# Check search visibility after deployment

A green Lighthouse report tests the build. It does not mean Google indexed the pages or that anyone found them in search.

1. After the GitHub Pages deployment, open [the production sitemap](https://flutter.ph/sitemap.xml). Check that the homepage and published event URLs appear and sample entries do not.
2. In [Search Console](https://search.google.com/search-console), select the verified flutter.ph property. Submit the sitemap under **Sitemaps**. Use **URL inspection** on the homepage and one event: record the indexing verdict, last crawl and Google-selected canonical. A newly published event may not be indexed yet.
3. Under **Performance → Search results**, use Web search and a completed 28-day period. Export clicks, impressions, CTR and average position for the exact queries “flutter philippines” and “flutter meetup manila”. Keep the dates with the export. Compare against the next complete 28-day period. A missing query is not proof of zero searches.
4. Use the event page filter to see which queries actually surface event pages. Look for relevant impressions and clicks, not just changes in average position.

## Repeatable export

As an alternative to using the UI, use a short-lived OAuth access token for a Google account with access to the verified property and the Search Console API enabled. Set `SEARCH_CONSOLE_ACCESS_TOKEN` in the shell, not in the repository. For a URL-prefix property, also set `SEARCH_CONSOLE_PROPERTY=https://flutter.ph/` (default: `sc-domain:flutter.ph`).

```sh
node scripts/search-baseline.mjs --submit-sitemap > ~/flutter-ph-search-baseline.json
```

Omit `--submit-sitemap` for read-only checks. Submission requires the `webmasters` scope; reporting also works with `webmasters.readonly`. The script checks that the event sitemap is live before contacting Google. It reports the index status of the homepage and one published event, plus the two exact queries over 28 days ending four days ago. A null metrics row means Google did not return data. Save dated copies outside the repo. See the [Search Console API reference](https://developers.google.com/webmaster-tools/v1/api_reference_index).
