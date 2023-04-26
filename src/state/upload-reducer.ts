import { FileState } from './state-types';

export type UploadAction =
  | { type: 'upload_drag_active'; fileState: FileState }
  | { type: 'upload_drag_leave'; fileState: FileState }
  | { type: 'upload_error_files'; fileState: FileState }
  | { type: 'upload_error_max_size'; fileState: FileState }
  | { type: 'upload_error_wrong_type'; fileState: FileState }
  | { type: 'upload_file_reset'; fileState: FileState }
  | { type: 'upload_file_success'; fileState: FileState };

export function uploadReducer(state: FileState, action: UploadAction) {
  switch (action.type) {
    case 'upload_drag_active': {
      return {
        ...state,
        file: null,
        currentFile: '',
        isFileSelected: false,
        errorMessage: '',
        isDragActive: true,
      };
    }
    case 'upload_drag_leave': {
      return {
        ...state,
        isDragActive: false,
      };
    }
    case 'upload_error_files': {
      return {
        ...state,
        file: null,
        currentFile: '',
        isFileSelected: false,
        errorMessage: 'Es werden zu viele Dateien auf einmal geladen.',
        isDragActive: false,
      };
    }
    case 'upload_error_max_size': {
      return {
        ...state,
        file: null,
        currentFile: '',
        isFileSelected: false,
        errorMessage: 'Die Datei ist grösser als die maximal zulässige Grösse.',
        isDragActive: false,
      };
    }
    case 'upload_error_wrong_type': {
      return {
        ...state,
        file: null,
        currentFile: '',
        isFileSelected: false,
        errorMessage: 'Die Datei hat den falschen Dateitypen.',
        isDragActive: false,
      };
    }
    case 'upload_file_reset': {
      return {
        ...state,
        file: null,
        currentFile: '',
        isFileSelected: false,
        errorMessage: '',
        isDragActive: false,
      };
    }
    case 'upload_file_success': {
      return {
        ...state,
        file: action.fileState.file,
        errorMessage: '',
        currentFile: action.fileState.currentFile,
        isFileSelected: true,
        isDragActive: false,
      };
    }
    default:
      throw new Error(`UploadReducer: Unknown action type`);
  }
}
