# Changelog

All notable changes to this project are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/).

## [2.1.0] - 2026-10-15
### Changed
- Faster ad skipping: ads are now muted and sped up to 16x instantly, even before their length is known
- Ads are detected the moment they start (player observer + video events + 100 ms backup timer instead of a 300 ms timer)
- The Skip button is clicked as soon as it appears, in the same pass as mute and fast-forward

## [2.0.0] - 2026-10-15
### Added
- Popup with ON/OFF switch, mute and fast-forward settings
- Live counters: ads skipped and estimated time saved
- Reset stats button
- Extension icons (16, 48, 128 px)
- YouTube Music support in the popup and content script

### Changed
- Skip button detection uses real visibility checks and simulated mouse events
- Settings and stats are stored with `chrome.storage.local`

## [1.2.0]
### Added
- Fast-forward fallback for ads without a Skip button
- Console logging for debugging

## [1.0.0]
### Added
- First version: clicks the Skip Ad button automatically
