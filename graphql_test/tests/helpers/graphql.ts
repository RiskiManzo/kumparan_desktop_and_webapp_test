import type { APIRequestContext, APIResponse } from '@playwright/test';

export const GRAPHQL_PATH = '/graphql';

/**
 * POST a GraphQL operation. Variables are sent as a separate JSON field,
 * never concatenated into the query string.
 */
export async function postGraphQL(
  request: APIRequestContext,
  query: string,
  variables?: Record<string, unknown>,
): Promise<APIResponse> {
  return request.post(GRAPHQL_PATH, { data: { query, variables } });
}
