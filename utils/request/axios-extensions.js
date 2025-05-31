import qs from 'qs';
// https://juejin.cn/post/6974902702400602148

function defaultGenerateReqKey(config) {
  const { method, url, params, data } = config;
  return [method, url, qs.stringify(params), qs.stringify(data)].join('&');
}

function isCacheLike(getCache, setCache, deleteCache) {
  return typeof getCache === 'function' && typeof setCache === 'function' && typeof deleteCache === 'function';
}

export function cacheAdapterEnhancer(options, defaultAdapter, generateReqKey) {
  if (typeof defaultAdapter !== 'function') {
    throw new TypeError('default defaultAdapter is not function');
  }
  const {
    enabledByDefault = true,
    cacheFlag = 'cache',
    getCache,
    setCache,
    deleteCache
  } = options;

  async function handelDefaultAdapter(config, requestKey, isLike, ttlConfig) {
    try {
      return await defaultAdapter(config); // 使用預設的xhrAdapter發送請求
    } catch (error) {
      if (isLike === true) {
        deleteCache(requestKey, ttlConfig);
      }
      throw error;
    }
  }

  return async config => {
    const { method, forceUpdate, ttlConfig = {} } = config;
    const useCache = config[cacheFlag] !== undefined && config[cacheFlag] !== null
      ? config[cacheFlag]
      : enabledByDefault;
    const isLike = isCacheLike(getCache, setCache, deleteCache);
    const requestKey = typeof generateReqKey === 'function' ? generateReqKey(config) : defaultGenerateReqKey(config); // 生成請求Key

    let responsePromise = null;
    if (useCache === true && isLike === true) {
      responsePromise = await getCache(requestKey, { ...ttlConfig, method }) || null; // 從快取中取得請求key對應的響應對象
    }

    if (responsePromise === null || forceUpdate) {
      // 快取未命中/失效或強制更新時，則重新請求資料
      responsePromise = handelDefaultAdapter(config, requestKey, isLike, { ...ttlConfig, method });

      if (isLike === true) {
        setCache(requestKey, responsePromise, { ...ttlConfig, method }); // 保存請求回傳的響應對象
      }
    }

    return responsePromise; // 回傳已經保存得響應對象
    // return defaultAdapter(config); // 使用預設的xhrAdapter發送請求
  };
}
export default cacheAdapterEnhancer;