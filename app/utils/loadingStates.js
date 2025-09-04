import { useState } from 'react';

// Loading states management
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

export function useAsyncOperation() {
  const [state, setState] = useState({
    status: LOADING_STATES.IDLE,
    data: null,
    error: null
  });

  const execute = async (asyncFunction) => {
    setState({
      status: LOADING_STATES.LOADING,
      data: null,
      error: null
    });

    try {
      const result = await asyncFunction();
      setState({
        status: LOADING_STATES.SUCCESS,
        data: result,
        error: null
      });
      return result;
    } catch (error) {
      setState({
        status: LOADING_STATES.ERROR,
        data: null,
        error
      });
      throw error;
    }
  };

  const reset = () => {
    setState({
      status: LOADING_STATES.IDLE,
      data: null,
      error: null
    });
  };

  return {
    ...state,
    execute,
    reset,
    isLoading: state.status === LOADING_STATES.LOADING,
    isSuccess: state.status === LOADING_STATES.SUCCESS,
    isError: state.status === LOADING_STATES.ERROR,
    isIdle: state.status === LOADING_STATES.IDLE
  };
}