# Contributing

Thanks for your interest in improving Auto Skip Ads for YouTube!

## Reporting a bug
1. Open an [issue](../../issues/new/choose) using the bug report template.
2. Include your browser and version, the extension version, and the Console output (F12 → Console).

## Suggesting a feature
Open an issue and describe what you would like and why it would help.

## Sending a pull request
1. Fork the repository and create a branch: `git checkout -b feature/my-change`
2. Load the extension with **Load unpacked** and test your change on YouTube.
3. Keep the code simple and commented where YouTube-specific selectors are used.
4. Update `CHANGELOG.md` and open a pull request describing what you changed.

## Updating selectors
YouTube changes its page often. If the Skip button stops being clicked, right-click it → **Inspect**, copy its class name and add it to `SKIP_SELECTORS` in `content.js`.