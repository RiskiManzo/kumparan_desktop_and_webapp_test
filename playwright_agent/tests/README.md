# Playwright tests — kumparan.com

Generated with the Playwright Agent from the brief in [specs/test_generation.md](../specs/test_generation.md).

## Run

```bash
npm install
npx playwright install chromium

npm test              # everything
npm run test:desktop  # @desktop tests against https://kumparan.com
npm run test:mobile   # @mobile tests against https://m.kumparan.com
npm run report        # open the HTML report
```

## Layout

| Path | Purpose |
| --- | --- |
| `tests/` | Generated spec files. Each test title carries a `@desktop` or `@mobile` tag. |
| `fixtures/site.ts` | Shared fixtures: opens the homepage and dismisses the ad overlay. |
| `kumparan_test_plan.md` | Test plan the specs were generated from (project root). |
| `specs/` | The generation brief given to the Playwright Agent. |
| `testcase/` | Test case table with expected vs actual results. |

## Conventions

- **Locators**: prefer `getByTestId` (`data-qa-id`), then `getByRole` / `getByLabel`. No CSS or XPath
  selectors and no dynamic ids.
- **Waiting**: rely on Playwright auto-waiting assertions (`toBeVisible`, `toHaveURL`, …). No fixed
  `waitForTimeout` sleeps.
- **Isolation**: every test starts from a fresh page and dismisses the ad/OTP overlay itself.
- **Non-destructive**: tests never post comments, share, report, or change account state.
