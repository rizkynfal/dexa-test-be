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

export const STATUS_CODE_SERVICE = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  BAD_GATEWAY: 502,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
};

