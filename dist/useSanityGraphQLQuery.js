var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { useQuery, fetchBuilder, graphqlRequestBody } from '@shopify/hydrogen';
import useSanityConfig from './useSanityConfig';
import useSanityShopifyProducts from './useSanityShopifyProducts';
/**
 * Hook to make server-only GROQ queries to a Sanity dataset.
 */
function useSanityGraphQLQuery(_a) {
    var { query, variables = {} } = _a, props = __rest(_a, ["query", "variables"]);
    const { projectId, apiVersion, dataset, token } = useSanityConfig(props.clientConfig);
    const body = graphqlRequestBody(query, variables);
    const url = `https://${projectId}.api.sanity.io/${apiVersion}/graphql/${dataset}/default`;
    const headers = {
        'content-type': 'application/json',
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    const { data: sanityData, error } = useQuery([projectId, body], fetchBuilder(url, {
        method: 'POST',
        headers,
        body,
    }));
    const shopifyProducts = useSanityShopifyProducts(sanityData === null || sanityData === void 0 ? void 0 : sanityData.data, props);
    return {
        sanityData: sanityData === null || sanityData === void 0 ? void 0 : sanityData.data,
        errors: error,
        shopifyProducts,
    };
}
export default useSanityGraphQLQuery;
