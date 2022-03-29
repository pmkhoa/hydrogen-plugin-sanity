const PRODUCT_PATTERN = 'shopifyProduct-';
const ensureShopifyId = (id) => {
    return id.replace(PRODUCT_PATTERN, '');
};
const ensureSanityId = (id) => {
    return `${PRODUCT_PATTERN}${ensureShopifyId(id)}`;
};
const stringToIds = (str) => {
    if (typeof str !== 'string') {
        return [];
    }
    const expression = new RegExp(`${PRODUCT_PATTERN}[\\w\\d]*`, 'gm');
    const matches = (str.match(expression) || []).filter(Boolean);
    if (!Array.isArray(matches) || matches.length <= 0) {
        return [];
    }
    return matches;
};
/**
 * Gets a flat array with every occurrence of shopify products, together with their Sanity & Shopify IDs & occurrences.
 */
const findProductsToFetch = (data, parents = []) => {
    if (typeof data === 'undefined' || data === null) {
        return [];
    }
    if (typeof data === 'string') {
        return stringToIds(data).map((id) => ({
            sanityId: ensureSanityId(id),
            shopifyId: ensureShopifyId(id),
            // @TODO: should we include the current string in occurrences?
            // occurrences: [[data, ...parents]],
            occurrences: [parents]
        }));
    }
    if (Array.isArray(data)) {
        return data.map((entry) => findProductsToFetch(entry, [data, ...parents])).flat();
    }
    if (typeof data === 'object' && data !== null) {
        return Object.keys(data)
            .map((key) => findProductsToFetch(data[key], [data, ...parents]))
            .flat();
    }
    return [];
};
/**
 * Consolidate Shopify products found into an Object with ids as keys.
 */
const extractProductsToFetch = (data) => {
    const toFetch = findProductsToFetch(data).filter((product) => Boolean(product.shopifyId) && Boolean(product.sanityId) && Array.isArray(product.occurrences));
    return toFetch.reduce((consolidated, curProduct) => {
        const existing = consolidated.find((p) => p.shopifyId === curProduct.shopifyId);
        if (!existing) {
            return [...consolidated, curProduct];
        }
        const existingOccurrences = (existing === null || existing === void 0 ? void 0 : existing.occurrences) || [];
        const existingIndex = consolidated.indexOf(existing);
        return [
            ...consolidated.slice(0, existingIndex),
            Object.assign(Object.assign({}, curProduct), { occurrences: [...existingOccurrences, ...curProduct.occurrences] }),
            ...consolidated.slice(existingIndex + 1)
        ];
    }, []);
};
export default extractProductsToFetch;
