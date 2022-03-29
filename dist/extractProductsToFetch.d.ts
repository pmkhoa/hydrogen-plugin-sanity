export interface ProductToFetch {
    shopifyId: string;
    sanityId: string;
    /**
     * Places where has this product been found.
     * It's an array of arrays, where each entry is an ordered list of "parents" of the current product.
     *
     * For example, a product's ID was found inside:
     * {
          "_id": "shopifyProduct-7342335787245",
          "store": {
            "handle": "special-product"
          }
        }
  
     * The object above will be found in `occurrences[0][0]` (the first parent of the first place the product was found).
     * And this continues until you get to the entire Sanity data as the final parent.
     *
     * See the README for an advanced example on how to use this to your advantage.
     */
    occurrences: unknown[][];
}
/**
 * Consolidate Shopify products found into an Object with ids as keys.
 */
declare const extractProductsToFetch: (data: unknown) => ProductToFetch[];
export default extractProductsToFetch;
