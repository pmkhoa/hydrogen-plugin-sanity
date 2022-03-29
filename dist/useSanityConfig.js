import { isClient } from '@shopify/hydrogen';
const useSanityConfig = (config = {}) => {
    if (isClient()) {
        throw new Error('Sanity requests should only be made in server components.');
    }
    if (!config.projectId) {
        throw new Error("[hydrogen-plugin-sanity] Missing project ID.\n Ensure it's defined in your hook's `clientConfig` object.");
    }
    if (!config.dataset) {
        throw new Error("[hydrogen-plugin-sanity] Missing dataset.\n Ensure it's defined in your hook's `clientConfig` object.");
    }
    if (!config.apiVersion) {
        throw new Error("[hydrogen-plugin-sanity] Missing apiVersion.\n Ensure it's defined in your hook's `clientConfig` object.");
    }
    return config;
};
export default useSanityConfig;
