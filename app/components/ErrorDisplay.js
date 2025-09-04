import React from 'react';
import { getErrorMessage } from '../utils/errorHandler';

const ErrorDisplay = ({ error, onRetry, onDismiss }) => {
  if (!error) return null;

  return (
    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            操作失败
          </h3>
          <div className="mt-2 text-sm text-red-700">
            {getErrorMessage(error)}
          </div>
          {(onRetry || onDismiss) && (
            <div className="mt-4 flex space-x-2">
              {onRetry && (
                <button
                  type="button"
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
                  onClick={onRetry}
                >
                  重试
                </button>
              )}
              {onDismiss && (
                <button
                  type="button"
                  className="bg-transparent hover:bg-red-100 text-red-600 px-3 py-1.5 text-xs font-medium rounded-md transition-colors"
                  onClick={onDismiss}
                >
                  关闭
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;