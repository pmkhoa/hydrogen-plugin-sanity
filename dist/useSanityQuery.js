var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
import { useQuery } from '@shopify/hydrogen';
import useSanityConfig from './useSanityConfig';
import useSanityShopifyProducts from './useSanityShopifyProducts';
/**
 * Hook to make server-only GROQ queries to a Sanity dataset.
 */
function useSanityQuery(_a) {
    var { query, params = {} } = _a, props = __rest(_a, ["query", "params"]);
    const { apiVersion, projectId, useCdn, dataset, token } = useSanityConfig(props.clientConfig);
    const version = apiVersion || 'v2021-10-24';
    const baseDomain = `${projectId}.${useCdn ? 'apicdn' : 'api'}.sanity.io`;
    const url = `https://${baseDomain}/${version.startsWith('v') ? version : `v${version}`}/data/query/${dataset}`;
    const { data: sanityData, error } = useQuery([query, params], () => __awaiter(this, void 0, void 0, function* () {
        const data = yield (yield fetch(url, {
            method: 'POST',
            headers: token
                ? {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
                : {
                    'Content-Type': 'application/json'
                },
            body: JSON.stringify({
                query,
                params
            })
        })).json();
        // if (!data.result) {
        //   throw new Error(data.error?.description || "[hydrogen-plugin-sanity] Couldn't fetch data")
        // }
        return data.result;
    }));
    const shopifyProducts = useSanityShopifyProducts(sanityData, props);
    return {
        sanityData,
        errors: error,
        shopifyProducts
    };
}
export default useSanityQuery;
