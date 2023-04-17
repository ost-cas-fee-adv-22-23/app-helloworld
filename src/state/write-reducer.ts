import { FileData, WriteState } from './state-types';

type WriteAction =
  | { type: 'file_error_reset' }
  | { type: 'file_upload_add'; payload: FileData }
  | { type: 'file_upload_submitting' }
  | { type: 'form_change'; textInput: string }
  | { type: 'form_submit_added' }
  | { type: 'form_submit_error'; error: string };

export function writeReducer(state: WriteState, action: WriteAction): WriteState {
  switch (action.type) {
    case 'file_error_reset': {
      return {
        ...state,
        form: {
          ...state.form,
          textInputError: '',
        },
        isSubmitting: false,
      };
    }
    case 'file_upload_add': {
      return {
        ...state,
        form: {
          ...state.form,
          file: action.payload.file,
          filename: action.payload.filename,
        },
        isSubmitting: false,
      };
    }
    case 'file_upload_submitting': {
      return {
        ...state,
        form: {
          ...state.form,
          textInputError: '',
        },
        isSubmitting: true,
      };
    }
    case 'form_change': {
      return {
        ...state,
        form: {
          ...state.form,
          textInput: action.textInput,
        },
      };
    }
    case 'form_submit_added': {
      return {
        ...state,
        form: {
          ...state.form,
          file: null,
          filename: '',
          textInput: '',
          textInputError: '',
        },
        isSubmitting: false,
      };
    }
    case 'form_submit_error': {
      return {
        ...state,
        form: {
          ...state.form,
          file: null,
          filename: '',
          textInput: '',
          textInputError: action.error,
        },
        isSubmitting: false,
      };
    }
    default:
      throw new Error(`WriteReducer: Unknown action type`);
  }
}
