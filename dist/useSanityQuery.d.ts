import { SanityQueryClientOptions, UseSanityQueryResponse } from './types';
interface UseSanityQueryProps extends SanityQueryClientOptions {
    /** A string of the GROQ query. */
    query: string;
    /** An object of the variables for the GROQ query. */
    params?: {
        [key: string]: unknown;
    };
}
/**
 * Hook to make server-only GROQ queries to a Sanity dataset.
 */
declare function useSanityQuery<T>({ query, params, ...props }: UseSanityQueryProps): UseSanityQueryResponse<T>;
export default useSanityQuery;
