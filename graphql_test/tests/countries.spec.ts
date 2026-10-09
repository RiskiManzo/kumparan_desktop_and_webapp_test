import { test, expect } from '@playwright/test';
import { postGraphQL, GRAPHQL_PATH } from './helpers/graphql';

/**
 * Countries API (https://countries.trevorblades.com/graphql), API-only.
 *
 * A GraphQL response has three parts to check: HTTP status, `data`, and
 * `errors`. A 200 can still carry GraphQL errors, so every test asserts
 * the parts that matter for its case.
 */

test.describe('GraphQL queries', () => {
  test('country by code returns expected fields', async ({ request }) => {
    const query = `
      query GetCountry($code: ID!) {
        country(code: $code) {
          name
          capital
          currency
          emoji
        }
      }
    `;

    const response = await postGraphQL(request, query, { code: 'ID' });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.errors, 'expected no GraphQL errors').toBeUndefined();
    expect(body.data.country).toMatchObject({
      name: 'Indonesia',
      capital: 'Jakarta',
      currency: 'IDR',
    });
    expect(body.data.country.emoji).toBeTruthy();
  });

  test('countries filtered by continent returns a non-empty list', async ({ request }) => {
    const query = `
      query CountriesInContinent($continent: String!) {
        countries(filter: { continent: { eq: $continent } }) {
          code
          name
          continent { code }
        }
      }
    `;

    const response = await postGraphQL(request, query, { continent: 'AS' });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.errors, 'expected no GraphQL errors').toBeUndefined();
    expect(body.data.countries.length).toBeGreaterThan(0);
    for (const country of body.data.countries) {
      expect(country.continent.code).toBe('AS');
    }
  });

  test('languages filtered by code returns the matching language', async ({ request }) => {
    const query = `
      query LanguageByCode($code: String!) {
        languages(filter: { code: { eq: $code } }) {
          code
          name
        }
      }
    `;

    const response = await postGraphQL(request, query, { code: 'en' });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.errors, 'expected no GraphQL errors').toBeUndefined();
    expect(body.data.languages).toContainEqual(
      expect.objectContaining({ code: 'en', name: 'English' }),
    );
  });

  test('continents list includes Asia', async ({ request }) => {
    const query = `
      query {
        continents {
          code
          name
        }
      }
    `;

    const response = await postGraphQL(request, query);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.errors, 'expected no GraphQL errors').toBeUndefined();
    expect(body.data.continents).toContainEqual({ code: 'AS', name: 'Asia' });
  });

  test('nested query with fragment resolves related fields', async ({ request }) => {
    const query = `
      fragment CountryBasics on Country {
        name
        capital
      }
      query CountryWithLanguages($code: ID!) {
        country(code: $code) {
          ...CountryBasics
          languages { code name }
        }
      }
    `;

    const response = await postGraphQL(request, query, { code: 'JP' });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.errors, 'expected no GraphQL errors').toBeUndefined();
    expect(body.data.country.name).toBe('Japan');
    expect(body.data.country.languages.length).toBeGreaterThan(0);
  });

  test('unknown country code returns null data without errors', async ({ request }) => {
    const query = `
      query GetCountry($code: ID!) {
        country(code: $code) { name }
      }
    `;

    const response = await postGraphQL(request, query, { code: 'ZZ' });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.errors, 'expected no GraphQL errors').toBeUndefined();
    expect(body.data.country).toBeNull();
  });
});

test.describe('GraphQL negative cases', () => {
  test('unknown field returns a validation error', async ({ request }) => {
    const query = `
      query {
        country(code: "ID") { notARealField }
      }
    `;

    const response = await postGraphQL(request, query);
    const body = await response.json();

    expect(body.errors, 'expected a validation error').toBeDefined();
    expect(body.errors[0].message).toMatch(/notARealField/);
    expect(body.data ?? null).toBeNull();
  });

  test('missing required variable returns an error', async ({ request }) => {
    const query = `
      query GetCountry($code: ID!) {
        country(code: $code) { name }
      }
    `;

    // Variable intentionally omitted
    const response = await postGraphQL(request, query, {});
    const body = await response.json();

    expect(body.errors, 'expected an error for missing variable').toBeDefined();
    expect(body.errors[0].message).toMatch(/code/);
  });

  test('wrong variable type returns an error', async ({ request }) => {
    const query = `
      query GetCountry($code: ID!) {
        country(code: $code) { name }
      }
    `;

    // ID! expects a string; an object is an invalid type
    const response = await postGraphQL(request, query, { code: { nested: true } });
    const body = await response.json();

    expect(body.errors, 'expected a type error').toBeDefined();
  });

  test('malformed query returns a syntax error', async ({ request }) => {
    const response = await postGraphQL(request, 'query { country(code: "ID") { name ');
    const body = await response.json();

    expect(response.ok()).toBeFalsy();
    expect(body.errors, 'expected a syntax error').toBeDefined();
  });

  test('GET with query param is accepted (documents current behavior)', async ({ request }) => {
    // This endpoint accepts GET queries. Asserting the observed behavior so a
    // change in transport support is caught.
    const response = await request.get(GRAPHQL_PATH, {
      params: { query: '{ continents { code } }' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.errors, 'expected no GraphQL errors').toBeUndefined();
    expect(body.data.continents.length).toBeGreaterThan(0);
  });
});
