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
 * @interface ResultSetDataInnerInner
 */
export interface ResultSetDataInnerInner {
}

/**
 * Check if a given object implements the ResultSetDataInnerInner interface.
 */
export function instanceOfResultSetDataInnerInner(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ResultSetDataInnerInnerFromJSON(json: any): ResultSetDataInnerInner {
    return ResultSetDataInnerInnerFromJSONTyped(json, false);
}

export function ResultSetDataInnerInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResultSetDataInnerInner {
    return json;
}

export function ResultSetDataInnerInnerToJSON(value?: ResultSetDataInnerInner | null): any {
    return value;
}

