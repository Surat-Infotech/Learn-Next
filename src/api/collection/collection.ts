import { omitBy, isEmpty, isNumber } from 'lodash';
import { createQueryKeys } from '@lukemorales/query-key-factory';

import { Api } from '..';
import { ICollectionResponse, ICollectionFilterRequest, ICollectionFilterResponse, ICollectionMetaDetailsRequest } from './types';

class Collection extends Api {
    readonly baseUrl: string = 'v2/collection';

    /**
     * Method to get collection
     */
    readonly filter = (slug: string, payload: ICollectionFilterRequest) =>
        this.http.post<ICollectionFilterResponse>(
            this.route(slug),
            omitBy(payload, (value) => isEmpty(value) && !isNumber(value))
        );

    /**
     * Method to get list collection
     */
    readonly getList = () => this.http.get<ICollectionResponse>(this.route(''));


    /**
     * Method to get single collection details
     */
    readonly getSingleCollection = (id: string) => this.http.get<ICollectionResponse>(this.route(`/details/${id}`));

    /**
     * Method to get single collection details using post
     */
    readonly getSingleCollectionUsingPost = (slug: string) => this.http.post<ICollectionResponse>(this.route(`/details/${slug}`));

    /**
     * Method to get single collection meta details
     */
    readonly getMetaDetailsBySlugs = (payload: ICollectionMetaDetailsRequest) => this._post<ICollectionResponse>(`/field/data`, payload);
}

export const collectionApi = new Collection();

export const collectionQuery = createQueryKeys('collection', {
    /**
     * Query to get collection
     */
    filter: (slug: string, payload: ICollectionFilterRequest) => ({
        queryKey: [slug, payload],
        queryFn: async () => {
            const { data } = await collectionApi.filter(slug, payload);
            return data.data;
        },
    }),
    /**
     * Query to get list collection
     */
    getList: () => ({
        queryKey: [''],
        queryFn: async () => {
            const { data } = await collectionApi.getList();
            return data.data;
        },
    }),
});
