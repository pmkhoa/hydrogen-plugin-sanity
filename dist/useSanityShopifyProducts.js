import extractProductsToFetch from './extractProductsToFetch';
import getShopifyVariables from './getShopifyVariables';
import productFragment from './productFragment';
import { useSkippableShopQuery } from './useSkippableShopQuery';
function getQuery(products, country) {
    // @TODO: replace with final ProductProviderFragment
    return `
  query getProducts(
    ${country ? "$country: CountryCode" : ""}
    $numProductMetafields: Int!
    $numProductVariants: Int!
    $numProductMedia: Int!
    $numProductVariantMetafields: Int!
    $numProductVariantSellingPlanAllocations: Int!
    $numProductSellingPlanGroups: Int!
    $numProductSellingPlans: Int!
  ) ${country ? "@inContext(country: $country)" : ""} {
    ${products
        .map((product, index) => `
      product${index}: product(id: "gid://shopify/Product/${product.shopifyId}") {
        ${product.fragment}
      }
    `)
        .join('\n')}
  }

  ${productFragment}
  `;
}
const useSanityShopifyProducts = (sanityData, options) => {
    const { getProductGraphQLFragment } = options;
    const shopifyVariables = getShopifyVariables(options.shopifyVariables);
    const productsToFetch = extractProductsToFetch(sanityData);
    const enhanceProductWithFragment = (product) => {
        if (typeof getProductGraphQLFragment === 'function') {
            const fragment = getProductGraphQLFragment(product);
            if (typeof fragment === 'string') {
                return Object.assign(Object.assign({}, product), { fragment });
            }
            else if (fragment === false) {
                return Object.assign(Object.assign({}, product), { fragment: undefined });
            }
        }
        return Object.assign(Object.assign({}, product), { fragment: '...ProductProviderFragment' });
    };
    const productsWithFragments = productsToFetch
        .map(enhanceProductWithFragment)
        .filter((product) => Boolean(product.fragment));
    const shouldFetch = productsWithFragments.length > 0;
    const finalQuery = shouldFetch ? getQuery(productsWithFragments, (shopifyVariables === null || shopifyVariables === void 0 ? void 0 : shopifyVariables.country) || '') : undefined;
    const { data: shopifyData } = useSkippableShopQuery({
        query: finalQuery,
        variables: shopifyVariables
    });
    const shopifyProducts = shopifyData
        ? Object.keys(shopifyData)
            .map((key) => ({ index: Number(key.replace('product', '')), key }))
            .map(({ index, key }) => {
            const { sanityId } = productsWithFragments[index] || {};
            if (!sanityId) {
                return undefined;
            }
            return {
                sanityId,
                content: shopifyData[key]
            };
        })
            .filter(Boolean)
            .reduce((finalObject, curProduct) => {
            if (!(curProduct === null || curProduct === void 0 ? void 0 : curProduct.sanityId)) {
                return finalObject;
            }
            return Object.assign(Object.assign({}, finalObject), { [curProduct.sanityId]: curProduct.content });
        }, {})
        : undefined;
    return shopifyProducts;
};
export default useSanityShopifyProducts;
