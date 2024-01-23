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
 * @interface ResultSetPartitionInfo
 */
export interface ResultSetPartitionInfo {
    /**
     * 
     * @type {number}
     * @memberof ResultSetPartitionInfo
     */
    rowCount: number;
}

/**
 * Check if a given object implements the ResultSetPartitionInfo interface.
 */
export function instanceOfResultSetPartitionInfo(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "rowCount" in value;

    return isInstance;
}

export function ResultSetPartitionInfoFromJSON(json: any): ResultSetPartitionInfo {
    return ResultSetPartitionInfoFromJSONTyped(json, false);
}

export function ResultSetPartitionInfoFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResultSetPartitionInfo {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'rowCount': json['rowCount'],
    };
}

export function ResultSetPartitionInfoToJSON(value?: ResultSetPartitionInfo | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'rowCount': value.rowCount,
    };
}

