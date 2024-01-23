export {
    InterfaceError,
    AuthenticationError,
    TimeoutError,
    ServerError,
    ServiceUnavailableError,
    SQLError,
    SqlState
}

class InterfaceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InterfaceError";
  }
}

class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AuthenticationError";
    }
}

class TimeoutError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "TimeoutError";
    }
}

class ServerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ServerError";
    }
}

class ServiceUnavailableError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ServiceUnavailableError";
    }
}

class SQLError extends Error {
    constructor(message: string, code: string, statementID: string) {
        super(message);
        this.name = "ServiceUnavailableError";
    }
}


enum SqlState {
	SqlState00000  = '00000',
	SqlState01000  = '01000',
	SqlState01004  = '01004',
	SqlState01006  = '01006',
	SqlState01007  = '01007',
	SqlState01P01  = '01P01',
	SqlState02000  = '02000',
	SqlState03000  = '03000',
	SqlState0A000  = '0A000',
	SqlState0L000  = '0L000',
	SqlState0LP01  = '0LP01',
	SqlState2BP01  = '2BP01',
	SqlState3D000  = '3D000',
	SqlState3D001  = '3D001',
	SqlState3D002  = '3D002',
	SqlState3D003  = '3D003',
	SqlState3D004  = '3D004',
	SqlState3D005  = '3D005',
	SqlState3D006  = '3D006',
	SqlState3D007  = '3D007',
	SqlState3D008  = '3D008',
	SqlState3D009  = '3D009',
	SqlState3D010  = '3D010',
	SqlState3D011  = '3D011',
	SqlState3E001  = '3E001',
	SqlState3E002  = '3E002',
	SqlState3E003  = '3E003',
	SqlState42501  = '42501',
	SqlState42601  = '42601',
	SqlState42622  = '42622',
	SqlState42710  = '42710',
	SqlState42P04  = '42P04',
	SqlState42P05  = '42P05',
	SqlState42P06  = '42P06',
	SqlState42P07  = '42P07',
	SqlState42P08  = '42P07',
	SqlState42P001 = '42P001',
	SqlState42P002 = '42P002',
	SqlState57014  = '57014',
	SqlState57015  = '57015',
	SqlState57000  = '57000',
	SqlState53000  = '53000',
	SqlStateXX000  = 'XX000',
	SqlStateXX001  = 'XX001',

    // Class 00 — Successful Completion

    SqlStateSuccessfulCompletion = SqlState00000,

	// Class 01 — Warning

	SqlStateWarning = SqlState01000,
	SqlStatePrivilegeNotGranted = SqlState01007,
	SqlStatePrivilegeNotRevoked = SqlState01006,
	SqlStateStringDataRightTruncation = SqlState01004,
	SqlStateDeprecatedFeature = SqlState01P01,

	// Class 02 — No Data (this is also a warning class per the SQL standard)

	SqlStateNoData = SqlState02000,

	// Class 03 — SQL Statement Not Yet Complete

	SqlStateSqlStatementNotYetComplete = SqlState03000,

	// Class 0A — Feature Not Supported

	SqlStateFeatureNotSupported = SqlState0A000,

	// Class 0L — Invalid Grantor

	SqlStateInvalidGrantor = SqlState0L000,
	SqlStateInvalidGrantOperation = SqlState0LP01,

	// Class 2B — Dependent Objects Still Exist

	SqlStateDependentObjectsStillExist = SqlState2BP01,

	// Class 3D — Invalid Objects (not found errors)

	SqlStateInvalidUser = SqlState3D000,
	SqlStateInvalidRole = SqlState3D001,
	SqlStateInvalidDatabase = SqlState3D002,
	SqlStateInvalidSchema = SqlState3D003,
	SqlStateInvalidOrganization = SqlState3D004,
	SqlStateInvalidRegion = SqlState3D005,
	SqlStateInvalidStore = SqlState3D006,
	SqlStateInvalidTopic = SqlState3D007,
	SqlStateInvalidParameter = SqlState3D008,
	SqlStateInvalidSchemaRegistry = SqlState3D009,
	SqlStateInvalidDescriptor = SqlState3D010,
	SqlStateInvalidDescriptorSource = SqlState3D011,

	// Class 3E — Resource not ready

	SqlStateStoreNotReady = SqlState3E001,
	SqlStateSchemaRegistryNotReady = SqlState3E002,
	SqlStateRelationNotReady = SqlState3E003,

	//Class 42 — Syntax Error or Access Rule Violation

	SqlStateInsufficientPrivilege = SqlState42501,
	SqlStateSyntaxError = SqlState42601,
	SqlStateNameTooLong = SqlState42622,
	SqlStateDuplicateObject = SqlState42710,
	SqlStateDuplicateDatabase = SqlState42P04,
	SqlStateDuplicateStore = SqlState42P05,
	SqlStateDuplicateSchema = SqlState42P06,
	SqlStateDuplicateUser = SqlState42P07,
	SqlStateDuplicateTopicDescriptor = SqlState42P08,
	SqlStateAmbiguousOrganization = SqlState42P001,
	SqlStateAmbiguousStore = SqlState42P002,

	// Class 53 — Insufficient Resources

	SqlStateConfigurationLimitExceeded = SqlState53000,

	// Class XX — Internal Error

	SqlStateInternalError = SqlStateXX000,
	SqlStateUndefined = SqlStateXX001,

	// Class 57 — Operator Intervention

	SqlStateCancelled = SqlState57000,
	SqlStateTimeout = SqlState57014,
	SqlStateRemoteUnavailable = SqlState57015,
}
