import { ASTNode } from 'graphql';
import { SanityQueryClientOptions, UseSanityQueryResponse } from './types';
interface UseSanityGraphQLQueryProps extends SanityQueryClientOptions {
    /** A string of the GraphQL query. */
    query: ASTNode | string;
    /** An object of the variables for the GraphQL query. */
    variables?: {
        [key: string]: any;
    };
}
/**
 * Hook to make server-only GROQ queries to a Sanity dataset.
 */
declare function useSanityGraphQLQuery<T>({ query, variables, ...props }: UseSanityGraphQLQueryProps): UseSanityQueryResponse<T>;
export default useSanityGraphQLQuery;
