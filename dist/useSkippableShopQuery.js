var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { isClient, useShop, useQuery, fetchBuilder, graphqlRequestBody } from '@shopify/hydrogen';
/**
 * Copy of Hydrogen's default useShopQuery that allows you to pass an `undefined` query for not fetching any data.
 * Is required by by hydrogen-plugin-sanity because we won't always have data to query from Shopify, and can't break the Rules of Hooks by not calling `useShopQuery` when that isn't needed.
 */
export function useSkippableShopQuery({ query, variables = {} }) {
    if (isClient()) {
        throw new Error('Shopify Storefront API requests should only be made from the server.');
    }
    const { storeDomain, storefrontApiVersion, storefrontToken } = useShop();
    const body = query ? graphqlRequestBody(query, variables) : undefined;
    const url = `https://${storeDomain}/api/${storefrontApiVersion}/graphql.json`;
    const { data } = useQuery([storeDomain, storefrontApiVersion, body], query
        ? fetchBuilder(url, {
            method: 'POST',
            headers: {
                'X-Shopify-Storefront-Access-Token': storefrontToken,
                'content-type': 'application/json'
            },
            body
        })
        : // If no query, return nothing
            // eslint-disable-next-line
            () => __awaiter(this, void 0, void 0, function* () { return ({ data: undefined, errors: undefined }); }));
    /**
     * GraphQL errors get printed to the console but ultimately
     * get returned to the consumer.
     */
    if (data === null || data === void 0 ? void 0 : data.errors) {
        const errors = data.errors instanceof Array ? data.errors : [data.errors];
        for (const error of errors) {
            console.error('GraphQL Error', error);
        }
        console.error(`GraphQL errors: ${errors.length}`);
    }
    return data;
}
