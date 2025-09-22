import { Api } from '..';
import { IHotjarSettingResponse } from './types';


class HotjarSetting extends Api {
    readonly baseUrl = '/v1/hotjar';

    /**
     * Get hotjar setting data
     */
    readonly get = () => this._all<IHotjarSettingResponse>();

}

export const hotjarSettingApi = new HotjarSetting();

export default hotjarSettingApi;
