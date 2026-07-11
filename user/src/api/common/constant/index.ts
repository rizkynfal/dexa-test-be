export const PAGINATION_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 10,
};

export const ORDER_CONSTANTS = [];

export const SuspiciousPatterns = [
  '<?php',
  '<?=',
  'eval(',
  'system(',
  'exec(',
  'passthru(',
  'shell_exec(',
  'popen(',
  'proc_open(',
  'base64_decode(',
  'gzinflate(',
  'gzuncompress(',
  'str_rot13(',
  'assert(',
  'create_function(',
  'include',
  'require',
  'include_once',
  'require_once',
  'file_get_contents(',
  'fopen(',
  'curl_exec(',
  'curl_multi_exec(',
  '$GLOBALS',
  '$_POST[',
  '$_GET[',
  '$HTTP_RAW_POST_DATA',
  'phpinfo(',
];

export const STATUS_CODE_GPRC = {
  OK: 0,
  CANCELLED: 1,
  UNKNOWN: 2,
  INVALID_ARGUMENT: 3,
  DEADLINE_EXCEEDED: 4,
  NOT_FOUND: 5,
  ALREADY_EXISTS: 6,
  PERMISSION_DENIED: 7,
  RESOURCE_EXHAUSTED: 8,
  FAILED_PRECONDITION: 9,
  ABORTED: 10,
  OUT_OF_RANGE: 11,
  UNIMPLEMENTED: 12,
  INTERNAL: 13,
  UNAVAILABLE: 14,
  DATA_LOSS: 15,
  UNAUTHENTICATED: 16,
};
export const EQUIPMENT_PLANNING_MODULE_CODE = {
  SCHEDULE: 'EP_SCHEDULE',
  SERVICE_BOARD: 'EP_SERVICE_BOARD',
  JOB_CARD: 'JOB_CARD',
};
