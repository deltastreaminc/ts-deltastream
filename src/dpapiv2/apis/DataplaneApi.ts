/* tslint:disable */
/* eslint-disable */
/**
 * DeltaStream Dataplane REST API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 2.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import * as runtime from '../runtime.ts';
import type {
  ErrorResponse,
  ResultSet,
  StatementStatus,
  Version,
} from '../models/index.ts';
import {
  ErrorResponseFromJSON,
  ErrorResponseToJSON,
  ResultSetFromJSON,
  ResultSetToJSON,
  StatementStatusFromJSON,
  StatementStatusToJSON,
  VersionFromJSON,
  VersionToJSON,
} from '../models/index.ts';

export interface GetStatementStatusRequest {
  statementID: string;
  sessionID?: string;
  partitionID?: number;
  timezone?: string;
}

/**
 *
 */
export class DataplaneApi extends runtime.BaseAPI {
  /**
   * Lookup the status of a statement.
   */
  async getStatementStatusRaw(
    requestParameters: GetStatementStatusRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<runtime.ApiResponse<ResultSet>> {
    if (
      requestParameters.statementID === null ||
      requestParameters.statementID === undefined
    ) {
      throw new runtime.RequiredError(
        'statementID',
        'Required parameter requestParameters.statementID was null or undefined when calling getStatementStatus.'
      );
    }

    const queryParameters: any = {};

    if (requestParameters.sessionID !== undefined) {
      queryParameters['sessionID'] = requestParameters.sessionID;
    }

    if (requestParameters.partitionID !== undefined) {
      queryParameters['partitionID'] = requestParameters.partitionID;
    }

    if (requestParameters.timezone !== undefined) {
      queryParameters['timezone'] = requestParameters.timezone;
    }

    const headerParameters: runtime.HTTPHeaders = {};

    if (this.configuration && this.configuration.accessToken) {
      const token = this.configuration.accessToken;
      const tokenString = await token('apiToken', []);

      if (tokenString) {
        headerParameters['Authorization'] = `Bearer ${tokenString}`;
      }
    }
    const response = await this.request(
      {
        path: `/statements/{statementID}`.replace(
          `{${'statementID'}}`,
          encodeURIComponent(String(requestParameters.statementID))
        ),
        method: 'GET',
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      ResultSetFromJSON(jsonValue)
    );
  }

  /**
   * Lookup the status of a statement.
   */
  async getStatementStatus(
    requestParameters: GetStatementStatusRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<ResultSet> {
    const response = await this.getStatementStatusRaw(
      requestParameters,
      initOverrides
    );
    return await response.value();
  }

  /**
   * Returns the server version
   */
  async getVersionRaw(
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<runtime.ApiResponse<Version>> {
    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    if (this.configuration && this.configuration.accessToken) {
      const token = this.configuration.accessToken;
      const tokenString = await token('apiToken', []);

      if (tokenString) {
        headerParameters['Authorization'] = `Bearer ${tokenString}`;
      }
    }
    const response = await this.request(
      {
        path: `/version`,
        method: 'GET',
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      VersionFromJSON(jsonValue)
    );
  }

  /**
   * Returns the server version
   */
  async getVersion(
    initOverrides?: RequestInit | runtime.InitOverrideFunction
  ): Promise<Version> {
    const response = await this.getVersionRaw(initOverrides);
    return await response.value();
  }
}
