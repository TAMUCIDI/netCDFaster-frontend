import { handleApiError, AppError, ERROR_CODES } from './errorHandler';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://127.0.0.1:5000';
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT || '30000');
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '52428800'); // 50MB

// Create fetch with timeout
function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  return fetch(url, {
    ...options,
    signal: controller.signal
  }).finally(() => {
    clearTimeout(timeoutId);
  }).catch((error) => {
    if (error.name === 'AbortError') {
      throw new AppError('请求超时', ERROR_CODES.TIMEOUT);
    }
    throw error;
  });
}

// File validation
export function validateFile(file) {
  if (!file) {
    throw new AppError('请选择文件', ERROR_CODES.INVALID_FILE_TYPE);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new AppError(
      `文件大小超过${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB限制`,
      ERROR_CODES.FILE_TOO_LARGE
    );
  }

  // Add netCDF file type validation if needed
  const validExtensions = ['.nc', '.nc4', '.netcdf'];
  const fileName = file.name.toLowerCase();
  const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    throw new AppError('请上传netCDF格式文件(.nc, .nc4, .netcdf)', ERROR_CODES.INVALID_FILE_TYPE);
  }
}

// URL validation
export function validateUrl(url) {
  if (!url || !url.trim()) {
    throw new AppError('请输入URL', ERROR_CODES.INVALID_URL);
  }

  try {
    new URL(url);
  } catch {
    throw new AppError('请输入有效的URL格式', ERROR_CODES.INVALID_URL);
  }
}

// API functions
export async function uploadFile(file) {
  validateFile(file);
  
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetchWithTimeout(`${API_BASE_URL}/file/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  handleApiError(response);
  return await response.json();
}

export async function processUrl(url) {
  validateUrl(url);
  
  const response = await fetchWithTimeout('/api/process-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url })
  });

  handleApiError(response);
  return await response.json();
}

export async function plotVariable(queryParams) {
  const queryString = new URLSearchParams(queryParams).toString();
  
  const response = await fetchWithTimeout(`${API_BASE_URL}/file/varplot?${queryString}`, {
    method: 'GET',
    credentials: 'include',
  });

  handleApiError(response);
  return await response.blob();
}