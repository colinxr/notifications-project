export declare function writeToStorage(id: string, data: any, storage: any): void;
export declare function hydrateStore(store: any, storage: any): void;
/**
 *
 * @param store pinia store
 * @param keys an array of keys to watch and write to localStorage.
 */
export declare function syncWithStorage(store: any, stateKeys: Array<string>, storage?: Storage): void;
