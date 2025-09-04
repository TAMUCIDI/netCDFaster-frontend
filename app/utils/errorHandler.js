// Error handling utilities
export class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  INVALID_URL: 'INVALID_URL',
  TIMEOUT: 'TIMEOUT',
  SERVER_ERROR: 'SERVER_ERROR'
};

export const ERROR_MESSAGES = {
  [ERROR_CODES.NETWORK_ERROR]: '网络连接失败，请检查网络设置',
  [ERROR_CODES.FILE_TOO_LARGE]: '文件大小超过限制，请选择较小的文件',
  [ERROR_CODES.INVALID_FILE_TYPE]: '不支持的文件类型，请上传netCDF文件',
  [ERROR_CODES.UPLOAD_FAILED]: '文件上传失败，请重试',
  [ERROR_CODES.INVALID_URL]: '无效的URL格式，请检查链接',
  [ERROR_CODES.TIMEOUT]: '请求超时，请检查网络连接',
  [ERROR_CODES.SERVER_ERROR]: '服务器错误，请稍后再试'
};

export function getErrorMessage(error) {
  if (error instanceof AppError) {
    return ERROR_MESSAGES[error.code] || error.message;
  }
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR];
  }
  
  return error.message || '发生未知错误';
}

export function handleApiError(response) {
  if (!response.ok) {
    switch (response.status) {
      case 400:
        throw new AppError('请求参数错误', ERROR_CODES.INVALID_URL, 400);
      case 413:
        throw new AppError('文件过大', ERROR_CODES.FILE_TOO_LARGE, 413);
      case 415:
        throw new AppError('文件类型不支持', ERROR_CODES.INVALID_FILE_TYPE, 415);
      case 500:
        throw new AppError('服务器内部错误', ERROR_CODES.SERVER_ERROR, 500);
      default:
        throw new AppError(`请求失败: ${response.status}`, ERROR_CODES.SERVER_ERROR, response.status);
    }
  }
  return response;
}