import { ASTNode } from 'graphql';
import { UseShopQueryResponse } from '@shopify/hydrogen/dist/esnext/hooks/useShopQuery/hooks';
/**
 * Copy of Hydrogen's default useShopQuery that allows you to pass an `undefined` query for not fetching any data.
 * Is required by by hydrogen-plugin-sanity because we won't always have data to query from Shopify, and can't break the Rules of Hooks by not calling `useShopQuery` when that isn't needed.
 */
export declare function useSkippableShopQuery<T>({ query, variables }: {
    /** A string of the GraphQL query. */
    query: ASTNode | string | undefined;
    /** An object of the variables for the GraphQL query. */
    variables?: {
        [key: string]: any;
    };
}): UseShopQueryResponse<T>;
