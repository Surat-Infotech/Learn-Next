import { Api } from '..';
import { IScriptSettingResponse } from './types';


class ScriptSetting extends Api {
    readonly baseUrl = '/v1/script';

    /**
     * Get hotjar setting data
     */
    readonly get = () => this._all<IScriptSettingResponse>();

}

export const scriptSettingApi = new ScriptSetting();

export default scriptSettingApi;
