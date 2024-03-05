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
import type { DataplaneRequest } from './DataplaneRequest';
import {
  DataplaneRequestFromJSON,
  DataplaneRequestFromJSONTyped,
  DataplaneRequestToJSON,
} from './DataplaneRequest';
import type { ResultSetColumnsInner } from './ResultSetColumnsInner';
import {
  ResultSetColumnsInnerFromJSON,
  ResultSetColumnsInnerFromJSONTyped,
  ResultSetColumnsInnerToJSON,
} from './ResultSetColumnsInner';
import type { ResultSetContext } from './ResultSetContext';
import {
  ResultSetContextFromJSON,
  ResultSetContextFromJSONTyped,
  ResultSetContextToJSON,
} from './ResultSetContext';
import type { ResultSetPartitionInfo } from './ResultSetPartitionInfo';
import {
  ResultSetPartitionInfoFromJSON,
  ResultSetPartitionInfoFromJSONTyped,
  ResultSetPartitionInfoToJSON,
} from './ResultSetPartitionInfo';

/**
 *
 * @export
 * @interface ResultSetMetadata
 */
export interface ResultSetMetadata {
  /**
   *
   * @type {string}
   * @memberof ResultSetMetadata
   */
  encoding: ResultSetMetadataEncodingEnum;
  /**
   *
   * @type {Array<ResultSetPartitionInfo>}
   * @memberof ResultSetMetadata
   */
  partitionInfo?: Array<ResultSetPartitionInfo>;
  /**
   *
   * @type {Array<ResultSetColumnsInner>}
   * @memberof ResultSetMetadata
   */
  columns?: Array<ResultSetColumnsInner>;
  /**
   *
   * @type {DataplaneRequest}
   * @memberof ResultSetMetadata
   */
  dataplaneRequest?: DataplaneRequest;
  /**
   *
   * @type {ResultSetContext}
   * @memberof ResultSetMetadata
   */
  context?: ResultSetContext;
}

/**
 * @export
 */
export const ResultSetMetadataEncodingEnum = {
  Json: 'json',
} as const;
export type ResultSetMetadataEncodingEnum =
  (typeof ResultSetMetadataEncodingEnum)[keyof typeof ResultSetMetadataEncodingEnum];

/**
 * Check if a given object implements the ResultSetMetadata interface.
 */
export function instanceOfResultSetMetadata(value: object): boolean {
  let isInstance = true;
  isInstance = isInstance && 'encoding' in value;

  return isInstance;
}

export function ResultSetMetadataFromJSON(json: any): ResultSetMetadata {
  return ResultSetMetadataFromJSONTyped(json, false);
}

export function ResultSetMetadataFromJSONTyped(
  json: any,
  ignoreDiscriminator: boolean
): ResultSetMetadata {
  if (json === undefined || json === null) {
    return json;
  }
  return {
    encoding: json['encoding'],
    partitionInfo: !exists(json, 'partitionInfo')
      ? undefined
      : (json['partitionInfo'] as Array<any>).map(
          ResultSetPartitionInfoFromJSON
        ),
    columns: !exists(json, 'columns')
      ? undefined
      : (json['columns'] as Array<any>).map(ResultSetColumnsInnerFromJSON),
    dataplaneRequest: !exists(json, 'dataplaneRequest')
      ? undefined
      : DataplaneRequestFromJSON(json['dataplaneRequest']),
    context: !exists(json, 'context')
      ? undefined
      : ResultSetContextFromJSON(json['context']),
  };
}

export function ResultSetMetadataToJSON(value?: ResultSetMetadata | null): any {
  if (value === undefined) {
    return undefined;
  }
  if (value === null) {
    return null;
  }
  return {
    encoding: value.encoding,
    partitionInfo:
      value.partitionInfo === undefined
        ? undefined
        : (value.partitionInfo as Array<any>).map(ResultSetPartitionInfoToJSON),
    columns:
      value.columns === undefined
        ? undefined
        : (value.columns as Array<any>).map(ResultSetColumnsInnerToJSON),
    dataplaneRequest: DataplaneRequestToJSON(value.dataplaneRequest),
    context: ResultSetContextToJSON(value.context),
  };
}
