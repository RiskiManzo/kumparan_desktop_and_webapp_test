# Test Cases — kumparan.com Playwright suite

Generated from the behaviour checks performed while building the automated suite
(see [../kumparan_test_plan.md](../kumparan_test_plan.md) and [../tests](../tests)).

- **Environment:** live production — `https://kumparan.com` (desktop, 1920×1080) and `https://m.kumparan.com` (Pixel 7).
- **Session:** anonymous, no account or seeded data available.
- **Execution:** `npx playwright test` → **19 passed / 0 failed** (last two consecutive runs green).
- **Status values:** PASS · BLOCKED (cannot be executed in this environment).
- **Actual Results** record what the automation observed on the live site.

## Desktop site exploration

| TC Number | Scenario | Steps | Expected Results | Actual Results |
| --- | --- | --- | --- | --- |
| TC_DES_1 | Header navigation is mapped and usable | 1. Open the homepage. 2. Inspect the header, search, home, theme, notification, login and compose controls. 3. Inspect the main and sub navigation. | All header controls resolve via `data-qa-id` and are visible; `input-search` is editable; the main menu lists News, Bisnis, Tekno, Entertainment, Bola & Sports; the sub menu lists Breaking News, Video Story, Audio Story, Trending. | **PASS** — all header controls found and visible; the main menu exposes the expected channels and the sub menu exposes the expected items; navigation landmarks resolved as `headermain menu` and `header sub menu`. |
| TC_DES_2 | Login entry point is reachable from the header | 1. Open the homepage. 2. Click the header login entry (`hd-login`). 3. Inspect the destination. | Navigation to `/login`; the email and password fields are visible. | **PASS** — `hd-login` is a button labelled "Masuk"; clicking it navigated to `https://kumparan.com/login` and both fields rendered. |
| TC_DES_3 | Article list and feed render headline cards | 1. Open the homepage. 2. Inspect the headline/trending section, a headline card, the trending list and the channel feed. | Card carries a non-empty title, source and date; the trending list and channel feed containers render. | **PASS** — 9 headline cards rendered with title, author and footer date; `trending-section`, `trending-story-item`, `grid-collection-list-container` and `showcase-title` all visible. |
| TC_DES_4 | Headline carousel advances with the next control | 1. Open the homepage. 2. Record the headline titles on screen. 3. Click the carousel next control. 4. Re-read the titles. | The next control is visible; after clicking, the carousel shows a different set of stories and remains usable. | **PASS** — next control (`carousel-right-control`) visible; the visible title set changed after each click (carousel scroll offset advanced 0 → 648 → 1296) while the carousel stayed interactive. |
| TC_DES_5 | Article images render with real sources | 1. Open the homepage. 2. Inspect the images inside a headline card. | Images are visible, every image has a non-empty `src` and `alt`, and images are served from the kumparan CDN. | **PASS** — 27 images inside headline cards, all with a non-empty `src` and `alt`; all served from `blue.kumparan.com`. |

## Mobile site exploration

| TC Number | Scenario | Steps | Expected Results | Actual Results |
| --- | --- | --- | --- | --- |
| TC_MOB_1 | Mobile header differs from the desktop header | 1. Open `m.kumparan.com` in a Pixel 7 viewport. 2. Inspect the header, burger menu and news bar. 3. Check for desktop-only controls. | Mobile header exposes burger menu, logo, search and notification; desktop-only `hd-login`, `create-story`, `main-menu` and `input-search` are absent; the news bar (`nb-*`) renders. | **PASS** — `header-top`, `burger-menu`, `hd-logo`, `hd-search`, `hd-notification` visible; `hd-login`, `create-story`, `main-menu` and `input-search` all had a count of 0; `nb-top-news`, `nb-video-story`, `nb-audio-story`, `nb-trending` visible. |
| TC_MOB_2 | Login flow is reached through the burger menu | 1. Open the mobile homepage. 2. Open the burger menu. 3. Tap "Masuk". 4. Inspect the destination. | The login entry is off-canvas until the menu opens, then becomes visible; tapping it reaches `/login` with the email and password fields. | **PASS** — the login entry measured off-canvas (x = −220px) before opening and in-viewport (x = 60px) after; tapping it navigated to `https://m.kumparan.com/login` with both fields visible. |
| TC_MOB_3 | The mobile page does not overflow horizontally | 1. Open the mobile homepage and measure `scrollWidth − innerWidth`. 2. Open an article and measure again. | No horizontal scrolling on either page (difference ≤ 0). | **PASS** — homepage difference 0px; article page difference 0px. |
| TC_MOB_4 | Content scrolls and the header stays pinned | 1. Open the mobile homepage and read `window.scrollY`. 2. Scroll down. 3. Re-read `scrollY` and inspect the header. | The page scrolls; the site header remains in the viewport and is `position: sticky`. | **PASS** — `scrollY` went 0 → 1500; the `<header>` (role `banner`) stayed at top = 0 with `position: sticky`. Note: mobile has no `header-section` test id — that is desktop-only. |
| TC_MOB_5 | Mobile article content is displayed in full | 1. Open a headline card on mobile. 2. Inspect the title, author and body. | Title, author and body render; the body text is not truncated. | **PASS** — title, author and 6 body paragraphs rendered on the mobile article page; the first paragraph measured 156 characters, confirming the body is not truncated. |

## Authentication

| TC Number | Scenario | Steps | Expected Results | Actual Results |
| --- | --- | --- | --- | --- |
| TC_AUTH_1 | Login form exposes its fields and data-qa-id hooks | 1. Open `/login`. 2. Inspect every form control. | Email field visible/editable with `type=text` and placeholder "Email"; password field visible/editable with `type=password`; submit, forgot-password, register, eye toggle and the three third-party buttons all visible; links point at `/forgot-password` and `/register`. | **PASS** — all controls present with `data-qa-id` hooks and correct attributes; `btn-forgot-password` → `/forgot-password`, `btn-register` → `/register`, third-party buttons for Facebook, Google and phone number. |
| TC_AUTH_2 | Password is masked and the visibility toggle reveals it | 1. Type a password. 2. Assert it is masked. 3. Click the eye control. 4. Assert it is revealed. 5. Click again and assert it is masked. | The field is `type=password` by default, becomes `type=text` when revealed, and returns to `type=password`. | **PASS** — toggled `password` → `text` → `password`. Note: the toggle swaps its own test id from `eye` to `eye-off` when revealed — a locator trap found and handled during healing. |
| TC_AUTH_3 | Submitting an empty form is blocked (negative) | 1. Open `/login` with both fields empty. 2. Inspect the submit button and the field-level error elements. | Submission is impossible; no field-level error is shown while the fields are untouched. | **PASS** — `btn-save` carries `disabled` and computes to `cursor: not-allowed` (opacity 0.5); no `input-email-errorMessage` or `input-password-errorMessage` rendered. |
| TC_AUTH_4 | A malformed email shows an inline validation message (negative) | 1. Enter `not-an-email` and a password. 2. Inspect the email field error. 3. Inspect the submit button. | An inline error "Harus diisi dengan format email" is shown; the form cannot be submitted and the visitor stays on `/login`. | **PASS** — `input-email-errorMessage` visible with text "Harus diisi dengan format email"; `btn-save` **remained disabled**, so the request never left the browser; URL unchanged. |
| TC_AUTH_5 | Wrong credentials are blocked by the unsolved captcha (negative) | 1. Enter a well-formed but non-existent email and a wrong password. 2. Inspect the Turnstile token. 3. Inspect the submit button and the session state. | Ideally a "wrong email or password" message is shown. | **BLOCKED** — the login form is protected by Cloudflare Turnstile; with an empty `cf-turnstile-response` token the submit button **never becomes enabled**, so the credentials are never sent and no error message can appear. This is an environment blocker (no captcha-solving capability), not a product defect. Attempting `.click()` hung for 90s because Playwright waits for the button to become enabled. |
| TC_AUTH_6 | No credential error is produced while the captcha is unsolved (negative) | 1. Fill wrong credentials. 2. Assert the visitor stays on `/login` and remains anonymous. | The visitor is not signed in; the page does not navigate; no unhandled error state is shown. | **PASS** — stayed on `https://kumparan.com/login`; the header still showed the anonymous "Masuk" entry; no inline error and no session was created. Documents the observable half of TC_AUTH_5. |

## Article detail

| TC Number | Scenario | Steps | Expected Results | Actual Results |
| --- | --- | --- | --- | --- |
| TC_ART_1 | Article title, author and body are visible | 1. Open an article from the homepage. 2. Inspect the title, author, publish date and reading time. 3. Inspect the body paragraphs and imagery. | Title, author, publish date and reading time all render; the body has several non-truncated paragraphs; article imagery renders. | **PASS** — `story-title` non-empty; `story-author` and `author-name` visible and non-empty; `publish-date` and `reading-time` visible; 12 body paragraphs with the first at 156 characters; 2 `image-figure` elements visible. |
| TC_ART_2 | Liking an article as an anonymous visitor requires sign-in | 1. Open an article. 2. Assert the like control and icon render. 3. Click the like button. 4. Inspect the resulting state. | Per the brief: the like state should change on the article. | **DEVIATION — PASS against actual** — the like state does **not** change. An anonymous visitor is redirected to `/login` within ~1s and the like count stays at 0. Verified 3/3 times in isolation. This is by design (likes require an account), so the assertion pins the redirect rather than the requested state change. The click is retried because the control is hydrated client-side. |
| TC_ART_3 | Share options are exposed and can be dismissed without sharing | 1. Open an article. 2. Inspect the share control and its options. 3. Use the copy-link option. 4. Dismiss the confirmation without sharing to a third party. | Per the brief: a share dialog lists the share options and can be closed without sharing. | **DEVIATION — PASS against actual** — there is **no modal share dialog** (`role=dialog` count = 0). The share options are exposed inline as `sosmed-whatsapp-white` (WhatsApp) and `copy-circle` (copy link). Clicking copy-link showed the transient alert "URL berhasil disalin"; the alert was closed via `alert-close` and the article stayed unchanged. Nothing was posted to a third party. |

## Defects and deviations summary

| # | Item | Type | Detail |
| --- | --- | --- | --- |
| 1 | Like requires authentication | Expected design, deviation from brief | The brief expects the like state to change; in reality an anonymous like redirects to `/login`. Not a defect — auth-gated by design. See TC_ART_2. |
| 2 | Share is inline, not a dialog | Expected design, deviation from brief | The brief expects a share dialog; desktop exposes inline share options plus a copy-link button with a success alert. Not a defect. See TC_ART_3. |
| 3 | Login cannot be exercised end-to-end | Test-environment blocker | Cloudflare Turnstile keeps the submit button disabled, so valid, invalid and wrong-credential submissions cannot be executed without a human solving the captcha. Not a defect. See TC_AUTH_5 / TC_AUTH_6. |

No product defect was confirmed in this suite. All three items above are either intended behaviour or
environment limitations, and in every case the assertion was left strict rather than relaxed.
