import { clients } from './https';

/**
 * GraphQL Client Module
 *
 * A GraphQL client utility that provides standardized methods for making GraphQL requests
 * using the existing HTTP client infrastructure. It handles authentication, error handling,
 * and follows the same patterns as the REST API client.
 *
 * Features:
 * - Typed request/response handling with generics
 * - Standardized methods for queries and mutations
 * - Automatic handling of authentication token expiration
 * - Consistent error handling with custom HttpError class
 * - Environment-based configuration
 *
 * @example
 * // Query request
 * const data = await graphqlClient.query<InventoryResponse>({
 *   query: GET_INVENTORY_QUERY,
 *   variables: { page: 1, pageSize: 10 }
 * });
 *
 * // Mutation request
 * const result = await graphqlClient.mutate<CreateInventoryResponse>({
 *   mutation: CREATE_INVENTORY_MUTATION,
 *   variables: { input: itemData }
 * });
 */

interface GraphQLRequest {
  query: string;
  variables?: Record<string, any>;
}

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

interface GraphQLClient {
  query<T>(request: GraphQLRequest): Promise<T>;
  mutate<T>(request: GraphQLRequest): Promise<T>;
}

const projectKey = import.meta.env.VITE_X_BLOCKS_KEY || '';
const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

const PROJECT_SLUG = import.meta.env.VITE_PROJECT_SLUG || '';

const projectSlug = PROJECT_SLUG ? `/${PROJECT_SLUG}` : '';
const GRAPHQL_BASE_URL = `${cleanBaseUrl}/uds/v1${projectSlug}/gateway`; //not finding

export const graphqlClient: GraphQLClient = {
  async query<T>(request: GraphQLRequest): Promise<T> {
    const payload = {
      query: request.query,
      variables: request.variables || {},
    };

    const response = await clients.post<GraphQLResponse<T>>(
      GRAPHQL_BASE_URL,
      JSON.stringify(payload),
      {
        'Content-Type': 'application/json',
        'x-blocks-key': projectKey,
      }
    );

    if (response.errors && response.errors.length > 0) {
      throw new Error(response.errors[0].message);
    }

    return (response.data as T) ?? ({} as T);
  },

  async mutate<T>(request: GraphQLRequest): Promise<T> {
    const payload = {
      query: request.query,
      variables: request.variables || {},
    };

    const response = await clients.post<GraphQLResponse<T>>(
      GRAPHQL_BASE_URL,
      JSON.stringify(payload),
      {
        'Content-Type': 'application/json',
        'x-blocks-key': projectKey,
      }
    );

    if (response.errors && response.errors.length > 0) {
      throw new Error(response.errors[0].message);
    }

    return response.data as T;
  },
};

export default graphqlClient;
