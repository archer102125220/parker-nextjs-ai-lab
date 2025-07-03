import axios from 'axios';
// import qs from 'qs';
import { LRUCache } from 'lru-cache';

// import cacheAdapterEnhancer from '@/utils/axios-extensions.js';
import cacheAdapterEnhancer from './axios-extensions.js';

// https://www.hai-fe.com/docs/nuxt/apiCache.html
// https://www.npmjs.com/package/lru-cache
// api資料快取儲存物件
const cacheCfg = new LRUCache({
  ttl: 1000 * 60 * 10,
  max: 100
});

export class cancelRequest {
  requestCancelerList = {};

  getRequestKey(method, url, params) {
    let requestKey = method.toLocaleLowerCase() + '|__|' + url;
    if (typeof params === 'object' && params !== null) {
      requestKey += '|__|' + JSON.stringify(params);
    }
    return requestKey;
  }

  addRequestCanceler(cancel, method = 'GET', url, params) {
    const key = this.getRequestKey(method, url, params);
    this.requestCancelerList[key] = cancel;
  }

  getRequestCanceler(method = 'GET', url, params) {
    const key = this.getRequestKey(method, url, params);
    return this.requestCancelerList[key];
  }

  removeRequestCanceler(method = 'GET', url, params) {
    const key = this.getRequestKey(method, url, params);
    this.requestCancelerList[key] = null;
  }

  handlerCancel = (method = 'GET', url, params) => {
    const key = this.getRequestKey(method, url, params);
    const requestCanceler = this.requestCancelerList[key] || {};
    if (typeof requestCanceler?.abort === 'function') {
      requestCanceler.abort();
      this.requestCancelerList[key] = null;
    }
  };

  handlerCancelAll = () => {
    const requestCancelerList = this.requestCancelerList;
    Object.keys(requestCancelerList).forEach((requestCancelerKey) => {
      const requestCanceler = requestCancelerList[requestCancelerKey] || {};
      if (typeof requestCanceler?.abort === 'function') {
        requestCanceler.abort();
        this.requestCancelerList[requestCancelerKey] = null;
      }
    });
  };
}

// eslint-disable-next-line new-cap
export const CancelRequest = new cancelRequest();

export function getCache(requestKey) {
  return cacheCfg.get(requestKey);
}
export function setCache(requestKey, response) {
  return cacheCfg.set(requestKey, response);
}
export function deleteCache(requestKey) {
  return cacheCfg.delete(requestKey);
}
export function removeCache() {
  return cacheCfg.clear();
}

// eslint-disable-next-line import/no-mutable-exports
export let ax = null;

export function axiosInit(baseURL, errorAdapter, defaultExtendOption) {
  ax = axios.create({
    baseURL,
    adapter: cacheAdapterEnhancer(
      {
        enabledByDefault: false,
        cacheFlag: 'useCache',
        getCache,
        setCache,
        deleteCache
      },
      function defaultAdapter(config) {
        delete config.adapter;
        return axios(config);
      }
    )
  });

  if (typeof window === 'undefined') {
    ax.interceptors.request.use(function (config) {
      let params = config.params;
      const _baseURL = config.baseURL || '';
      const configData = config.data;
      const token = config.headers?.token || config.headers?.ez1;
      if (configData && typeof configData === 'string') {
        params = JSON.parse(configData);
      } else if (configData) {
        params = configData;
      }
      let requestPath = 'request: ' + config.method + '__';
      if (config.url?.includes('http')) {
        requestPath += config.url;
      } else {
        requestPath += _baseURL + config.url;
      }
      if (typeof params === 'object' && params !== null) {
        requestPath += ' params: ' + JSON.stringify(params);
      }
      if (token) {
        requestPath += '__token:' + token;
      }
      console.log('\x1b[33m%s\x1b[0m ', requestPath);
      return config;
    });
  }

  ax.interceptors.request.use(function (config) {
    const controller = new AbortController();
    let params = config.params;
    const configData = config.data;
    if (configData && typeof configData === 'string') {
      params = JSON.parse(configData);
    } else if (configData) {
      params = configData;
    }
    const cfg = {
      ...config,
      signal: controller.signal
    };
    CancelRequest.addRequestCanceler(
      controller,
      config.method,
      config.url,
      params
    );
    return cfg;
  }, errorAdapter);
  request.ax = ax;
  request.axios = axios;
  request.baseURL = baseURL;
  request.errorAdapter = errorAdapter;
  request.defaultExtendOption = defaultExtendOption;

  return request;
}

export function request(
  _method = 'GET',
  url,
  _params = {},
  _extendOption = {},
  hasErrorAdapter = true
) {
  const method = _method.toUpperCase();
  const defaultExtendOption = request.defaultExtendOption;
  let params = {};

  let extendOption = _extendOption;
  if (typeof defaultExtendOption === 'function') {
    extendOption = defaultExtendOption(_extendOption) || {};
  } else if (
    typeof defaultExtendOption === 'object' &&
    defaultExtendOption !== null
  ) {
    extendOption = { ...defaultExtendOption, ..._extendOption };
  }

  switch (method) {
    case (method.match(/POST|PUT|PATCH/) || {}).input:
      params.data = _params;
      break;
    case (method.match(/GET/) || {}).input:
      params.params = _params;
      break;
    case 'DELETE':
      // params.params = _params;
      params.data = _params;
      break;
    default:
      params = {};
      break;
  }

  if (extendOption.useServiceWorkerCache === true) {
    if (typeof extendOption.headers === 'object' && extendOption.headers !== null) {
      extendOption.headers['X-Is-Cacheable'] = 'true';
      extendOption.headers['Cache-Control'] = 'max-age=604800';
    } else {
      extendOption.headers = { 'X-Is-Cacheable': 'true', 'Cache-Control': 'max-age=604800' };
    }
  }
  // console.log({ headers: extendOption.headers, extendOption });

  const _ax = ax || axios;

  return _ax
    .request({
      url,
      method,
      // paramsSerializer: (params) => {
      //   return qs.stringify(params, { encodeValuesOnly: true });
      // },
      paramsSerializer: {
        // https://github.com/axios/axios/issues/5058#issuecomment-1272107602
        // encode: (params) => {
        //   console.log(qs.stringify(params, { encodeValuesOnly: true }), params);
        //   return qs.stringify(params, { encodeValuesOnly: true });
        // },
        indexes: null
      },
      ...params,
      ...extendOption
      // withCredentials: true,
    })
    .then((response) => {
      const { config, data } = response;
      let params = config.params;
      const configData = config.data;
      if (configData && typeof configData === 'string') {
        try {
          params = JSON.parse(configData);
        } catch (error) {
          params = configData;
        }
      } else if (configData) {
        params = configData;
      }
      CancelRequest.removeRequestCanceler(config.method, config.url, params);
      return data;
    })
    .catch(async (error) => {
      if (hasErrorAdapter === true && typeof request.errorAdapter === 'function') {
        try {
          const headers = extendOption?.headers;
          const response = await request.errorAdapter(error, (newHeaders) =>
            request(
              _method,
              url,
              _params,
              { ...extendOption, headers: { ...headers, ...newHeaders } },
              false
            )
          );
          if (typeof response === 'object' && response !== null) {
            return response;
          }
        } catch (error) {
          console.log('errorAdapter', error);
        }
      }
      const errorStatus = error?.response?.status;
      if (typeof error?.response !== 'object' || error?.response === null) {
        if (errorStatus === undefined) {
          error.response = {
            status: 500
          };
        } else {
          error.response.status = 500;
        }
      }
      if (typeof window === 'undefined') {
        console.log('\x1b[31m%s\x1b[0m ', error);
      } else {
        try {
          console.log(`%c${JSON.stringify(error)}`, 'color:red');
        } catch (_e) {
          console.log(`%c${error}`, 'color:red');
        }
      }
      throw error;
    });
}

request.get = function (...arg) {
  return request('GET', ...arg);
};
request.post = function (...arg) {
  return request('POST', ...arg);
};
request.put = function (...arg) {
  return request('PUT', ...arg);
};
request.delete = function (...arg) {
  return request('DELETE', ...arg);
};
request.patch = function (...arg) {
  return request('PATCH', ...arg);
};
request.cancel = CancelRequest.handlerCancel;
request.getCancel = function (...arg) {
  return CancelRequest.handlerCancel('get', ...arg);
};
request.postCancel = function (...arg) {
  return CancelRequest.handlerCancel('post', ...arg);
};
request.putCancel = function (...arg) {
  return CancelRequest.handlerCancel('put', ...arg);
};
request.deleteCancel = function (...arg) {
  return CancelRequest.handlerCancel('delete', ...arg);
};
request.patchCancel = function (...arg) {
  return CancelRequest.handlerCancel('patch', ...arg);
};
request.cancelAll = CancelRequest.handlerCancelAll;

export default axiosInit;
