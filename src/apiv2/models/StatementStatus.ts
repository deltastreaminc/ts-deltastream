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
 * @interface StatementStatus
 */
export interface StatementStatus {
    /**
     * 
     * @type {string}
     * @memberof StatementStatus
     */
    sqlState: string;
    /**
     * 
     * @type {string}
     * @memberof StatementStatus
     */
    message?: string;
    /**
     * 
     * @type {string}
     * @memberof StatementStatus
     */
    statementID: string;
    /**
     * IDs for each statement when a multi-statement SQL is submitted
     * @type {Array<string>}
     * @memberof StatementStatus
     */
    statementIDs?: Array<string>;
    /**
     * UTC POSIX timestamp of when statement was submitted
     * @type {number}
     * @memberof StatementStatus
     */
    createdOn: number;
}

/**
 * Check if a given object implements the StatementStatus interface.
 */
export function instanceOfStatementStatus(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "sqlState" in value;
    isInstance = isInstance && "statementID" in value;
    isInstance = isInstance && "createdOn" in value;

    return isInstance;
}

export function StatementStatusFromJSON(json: any): StatementStatus {
    return StatementStatusFromJSONTyped(json, false);
}

export function StatementStatusFromJSONTyped(json: any, ignoreDiscriminator: boolean): StatementStatus {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'sqlState': json['sqlState'],
        'message': !exists(json, 'message') ? undefined : json['message'],
        'statementID': json['statementID'],
        'statementIDs': !exists(json, 'statementIDs') ? undefined : json['statementIDs'],
        'createdOn': json['createdOn'],
    };
}

export function StatementStatusToJSON(value?: StatementStatus | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'sqlState': value.sqlState,
        'message': value.message,
        'statementID': value.statementID,
        'statementIDs': value.statementIDs,
        'createdOn': value.createdOn,
    };
}

