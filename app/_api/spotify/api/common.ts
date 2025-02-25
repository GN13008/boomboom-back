/* tslint:disable */
/* eslint-disable */
/**
 * Spotify Web API
 * You can use Spotify\'s Web API to discover music and podcasts, manage your Spotify library, control audio playback, and much more. Browse our available Web API endpoints using the sidebar at left, or via the navigation bar on top of this page on smaller screens.  In order to make successful Web API requests your app will need a valid access token. One can be obtained through <a href=\"https://developer.spotify.com/documentation/general/guides/authorization-guide/\">OAuth 2.0</a>.  The base URI for all Web API requests is `https://api.spotify.com/v1`.  Need help? See our <a href=\"https://developer.spotify.com/documentation/web-api/guides/\">Web API guides</a> for more information, or visit the <a href=\"https://community.spotify.com/t5/Spotify-for-Developers/bd-p/Spotify_Developer\">Spotify for Developers community forum</a> to ask questions and connect with other developers.
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import type { AxiosInstance, AxiosResponse } from 'axios'
import { RequestArgs, RequiredError } from '#api/spotify/api/base'
import { Configuration } from '#api/spotify/api/configuration'

/**
 *
 * @export
 */
export const DUMMY_BASE_URL = 'https://example.com'

/**
 *
 * @throws {RequiredError}
 * @export
 */
export const assertParamExists = function (
  functionName: string,
  paramName: string,
  paramValue: unknown
) {
  if (paramValue === null || paramValue === undefined) {
    throw new RequiredError(
      paramName,
      `Required parameter ${paramName} was null or undefined when calling ${functionName}.`
    )
  }
}

/**
 *
 * @export
 */
export const setApiKeyToObject = async function (
  object: any,
  keyParamName: string,
  configuration?: Configuration
) {
  if (configuration && configuration.apiKey) {
    const localVarApiKeyValue =
      typeof configuration.apiKey === 'function'
        ? await configuration.apiKey(keyParamName)
        : await configuration.apiKey
    object[keyParamName] = localVarApiKeyValue
  }
}

/**
 *
 * @export
 */
export const setBasicAuthToObject = function (object: any, configuration?: Configuration) {
  if (configuration && (configuration.username || configuration.password)) {
    object['auth'] = { username: configuration.username, password: configuration.password }
  }
}

/**
 *
 * @export
 */
export const setBearerAuthToObject = async function (object: any, configuration?: Configuration) {
  if (configuration && configuration.accessToken) {
    const accessToken =
      typeof configuration.accessToken === 'function'
        ? await configuration.accessToken()
        : await configuration.accessToken
    object['Authorization'] = 'Bearer ' + accessToken
  }
}

/**
 *
 * @export
 */
export const setOAuthToObject = async function (
  object: any,
  name: string,
  scopes: string[],
  configuration?: Configuration
) {
  if (configuration && configuration.accessToken) {
    const localVarAccessTokenValue =
      typeof configuration.accessToken === 'function'
        ? await configuration.accessToken(name, scopes)
        : await configuration.accessToken
    object['Authorization'] = 'Bearer ' + localVarAccessTokenValue
  }
}

function setFlattenedQueryParams(
  urlSearchParams: URLSearchParams,
  parameter: any,
  key: string = ''
): void {
  if (parameter == null) return
  if (typeof parameter === 'object') {
    if (Array.isArray(parameter)) {
      ;(parameter as any[]).forEach((item) => setFlattenedQueryParams(urlSearchParams, item, key))
    } else {
      Object.keys(parameter).forEach((currentKey) =>
        setFlattenedQueryParams(
          urlSearchParams,
          parameter[currentKey],
          `${key}${key !== '' ? '.' : ''}${currentKey}`
        )
      )
    }
  } else {
    if (urlSearchParams.has(key)) {
      urlSearchParams.append(key, parameter)
    } else {
      urlSearchParams.set(key, parameter)
    }
  }
}

/**
 *
 * @export
 */
export const setSearchParams = function (url: URL, ...objects: any[]) {
  const searchParams = new URLSearchParams(url.search)
  setFlattenedQueryParams(searchParams, objects)
  url.search = searchParams.toString()
}

/**
 *
 * @export
 */
export const serializeDataIfNeeded = function (
  value: any,
  requestOptions: any,
  configuration?: Configuration
) {
  const nonString = typeof value !== 'string'
  const needsSerialization =
    nonString && configuration && configuration.isJsonMime
      ? configuration.isJsonMime(requestOptions.headers['Content-Type'])
      : nonString
  return needsSerialization ? JSON.stringify(value !== undefined ? value : {}) : value || ''
}

/**
 *
 * @export
 */
export const toPathString = function (url: URL) {
  return url.pathname + url.search + url.hash
}

/**
 *
 * @export
 */
export const createRequestFunction = function (
  axiosArgs: RequestArgs,
  globalAxios: AxiosInstance,
  BASE_PATH: string,
  configuration?: Configuration
) {
  return <T = unknown, R = AxiosResponse<T>>(
    axios: AxiosInstance = globalAxios,
    basePath: string = BASE_PATH
  ) => {
    const axiosRequestArgs = {
      ...axiosArgs.options,
      url: (axios.defaults.baseURL ? '' : configuration?.basePath ?? basePath) + axiosArgs.url,
    }
    return axios.request<T, R>(axiosRequestArgs)
  }
}
