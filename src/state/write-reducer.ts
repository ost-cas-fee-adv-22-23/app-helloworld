import { WriteState } from './helpers/write-helpers';

type WriteAction =
  | { type: 'file_inputerror_reset' }
  | { type: 'file_upload_add'; payload: File }
  | { type: 'file_upload_reset' }
  | { type: 'form_change'; textInput: string }
  | { type: 'form_submit_added' }
  | { type: 'form_submit_error'; payload: string }
  | { type: 'submit_form_success' };

export function writeReducer(state: WriteState, action: WriteAction): WriteState {
  switch (action.type) {
    case 'file_upload_reset': {
      return {
        ...state,
        form: {
          ...state.form,
          file: null,
        },
      };
    }
    case 'file_upload_add': {
      return {
        ...state,
        form: {
          ...state.form,
          file: action.payload,
        },
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
          textInput: '',
          textInputError: '',
        },
      };
    }
    default:
      throw new Error(`WriteReducer: Unknown action type`);
  }
}
