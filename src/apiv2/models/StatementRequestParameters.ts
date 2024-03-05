/* tslint:disable */
/* eslint-disable */
/**
 * DeltaStream REST API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 2.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 *
 * @export
 * @interface StatementRequestParameters
 */
export interface StatementRequestParameters {
  /**
   *
   * @type {string}
   * @memberof StatementRequestParameters
   */
  timezone?: string;
  /**
   *
   * @type {string}
   * @memberof StatementRequestParameters
   */
  sessionID?: string;
}

/**
 * Check if a given object implements the StatementRequestParameters interface.
 */
export function instanceOfStatementRequestParameters(value: object): boolean {
  let isInstance = true;

  return isInstance;
}

export function StatementRequestParametersFromJSON(
  json: any
): StatementRequestParameters {
  return StatementRequestParametersFromJSONTyped(json, false);
}

export function StatementRequestParametersFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): StatementRequestParameters {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    timezone: !exists(json, 'timezone') ? undefined : json['timezone'],
    sessionID: !exists(json, 'sessionID') ? undefined : json['sessionID'],
  };
}

export function StatementRequestParametersToJSON(
  value?: StatementRequestParameters | null
): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    timezone: value.timezone,
    sessionID: value.sessionID,
  };
}
