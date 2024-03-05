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
 * @interface ResultSetContext
 */
export interface ResultSetContext {
  /**
   *
   * @type {string}
   * @memberof ResultSetContext
   */
  organizationID?: string;
  /**
   *
   * @type {string}
   * @memberof ResultSetContext
   */
  roleName?: string;
  /**
   *
   * @type {string}
   * @memberof ResultSetContext
   */
  databaseName?: string;
  /**
   *
   * @type {string}
   * @memberof ResultSetContext
   */
  schemaName?: string;
  /**
   *
   * @type {string}
   * @memberof ResultSetContext
   */
  storeName?: string;
}

/**
 * Check if a given object implements the ResultSetContext interface.
 */
export function instanceOfResultSetContext(value: object): boolean {
  let isInstance = true;

  return isInstance;
}

export function ResultSetContextFromJSON(json: any): ResultSetContext {
  return ResultSetContextFromJSONTyped(json, false);
}

export function ResultSetContextFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ResultSetContext {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    organizationID: !exists(json, 'organizationID')
      ? undefined
      : json['organizationID'],
    roleName: !exists(json, 'roleName') ? undefined : json['roleName'],
    databaseName: !exists(json, 'databaseName')
      ? undefined
      : json['databaseName'],
    schemaName: !exists(json, 'schemaName') ? undefined : json['schemaName'],
    storeName: !exists(json, 'storeName') ? undefined : json['storeName'],
  };
}

export function ResultSetContextToJSON(value?: ResultSetContext | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    organizationID: value.organizationID,
    roleName: value.roleName,
    databaseName: value.databaseName,
    schemaName: value.schemaName,
    storeName: value.storeName,
  };
}
