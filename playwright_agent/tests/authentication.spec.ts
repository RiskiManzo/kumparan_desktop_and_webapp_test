// spec: kumparan_test_plan.md
// seed: fixtures/site.ts

import { test, expect } from '../fixtures/site';

test.describe('Authentication', () => {
  test('3.1 login form exposes its fields and data-qa-id hooks @desktop', async ({ loginPage: page }) => {
    // 1. Assert the email field is usable and correctly described
    const email = page.getByTestId('input-email');
    await expect(email).toBeVisible();
    await expect(email).toBeEditable();
    await expect(email).toHaveAttribute('type', 'text');
    await expect(email).toHaveAttribute('placeholder', 'Email');

    // 2. Assert the password field is present and masked
    const password = page.getByTestId('input-password');
    await expect(password).toBeVisible();
    await expect(password).toBeEditable();
    await expect(password).toHaveAttribute('type', 'password');

    // 3. Assert every control on the form carries a data-qa-id hook
    await expect(page.getByTestId('btn-save')).toHaveText('Masuk');
    await expect(page.getByTestId('btn-forgot-password')).toHaveAttribute('href', '/forgot-password');
    await expect(page.getByTestId('btn-register')).toHaveAttribute('href', '/register');
    await expect(page.getByTestId('eye')).toBeVisible();
    await expect(page.getByTestId('btn-login-fb')).toBeVisible();
    await expect(page.getByTestId('btn-login-google')).toBeVisible();
    await expect(page.getByTestId('btn-login-phone')).toBeVisible();
  });

  test('3.2 password is masked and the visibility toggle reveals it @desktop', async ({ loginPage: page }) => {
    const password = page.getByTestId('input-password');

    // 1. Type a password and assert it stays masked
    await password.fill('Secret123');
    await expect(password).toHaveAttribute('type', 'password');

    // 2. Reveal it with the eye control. The control swaps its test id once the
    //    password is visible ("eye" -> "eye-off"), so the reverse control is targeted next.
    await page.getByTestId('eye').click();
    await expect(password).toHaveAttribute('type', 'text');

    // 3. Hide it again
    await page.getByTestId('eye-off').click();
    await expect(password).toHaveAttribute('type', 'password');
  });

  test('3.3 submitting an empty form is blocked @desktop', async ({ loginPage: page }) => {
    // 1. Assert the submit button is disabled while both fields are empty
    const submit = page.getByTestId('btn-save');
    await expect(submit).toBeVisible();
    await expect(submit).toBeDisabled();
    await expect(submit).toHaveCSS('cursor', 'not-allowed');

    // 2. Assert no field-level validation message is shown
    await expect(page.getByTestId('input-email-errorMessage')).toBeHidden();
    await expect(page.getByTestId('input-password-errorMessage')).toBeHidden();
  });

  test('3.4 a malformed email shows an inline validation message @desktop', async ({ loginPage: page }) => {
    // 1. Fill the form with an invalid email format
    await page.getByTestId('input-email').fill('not-an-email');
    await page.getByTestId('input-password').fill('WrongPassword123!');

    // 2. Assert the inline validation message is shown
    const emailError = page.getByTestId('input-email-errorMessage');
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveText(/format email/i);

    // 3. Assert the form refuses to submit: the button stays disabled and the visitor stays put
    await expect(page.getByTestId('btn-save')).toBeDisabled();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('3.5 wrong credentials are blocked by the unsolved captcha @desktop', async ({ loginPage: page }) => {
    // 1. Fill the form with a well-formed but non-existent account
    await page.getByTestId('input-email').fill('qa.nonexistent.user@example.com');
    await page.getByTestId('input-password').fill('WrongPassword123!');
    await expect(page.getByTestId('input-email-errorMessage')).toBeHidden();

    // kumparan protects /login with Cloudflare Turnstile. While the token is empty the submit
    // button never becomes enabled, so the wrong-credentials path cannot be exercised and no
    // "wrong email or password" message can be asserted. This test pins that observable
    // behaviour instead of forcing an assertion that cannot be reached.
    const turnstileSolved = await page.evaluate(() => {
      const token = document.querySelector('input[name="cf-turnstile-response"]');
      return token instanceof HTMLInputElement && token.value.length > 0;
    });
    expect(turnstileSolved, 'Cloudflare Turnstile must be solved for the submit to reach the API').toBe(false);

    // 2. Assert submission is blocked: the button is disabled no matter how the fields are filled
    await expect(page.getByTestId('btn-save')).toBeDisabled();

    // 3. Assert the visitor is still anonymous and still on the login page
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByTestId('hd-login').first()).toBeVisible();
    await expect(page.getByTestId('input-email')).toHaveValue('qa.nonexistent.user@example.com');
  });
});
