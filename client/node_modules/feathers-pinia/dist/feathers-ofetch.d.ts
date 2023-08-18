import { FetchClient } from '@feathersjs/rest-client';
import type { Params } from '@feathersjs/feathers';
export declare class OFetch extends FetchClient {
    request(options: any, params: Params): Promise<any>;
}
