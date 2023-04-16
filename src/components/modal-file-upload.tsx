import {
  Button,
  CancelIcon,
  CheckmarkIcon,
  FileUpload,
  Modal,
  UploadState,
} from '@smartive-education/design-system-component-library-hello-world-team';
import React, { useReducer } from 'react';
import { uploadReducer } from '../state/upload-reducer';
import { convertToFileState, convertToUploadAction } from '../utils/convert-to';
import { FileState } from '../state/state-types';

interface ModalFileUpload {
  title: string;
  isOpen: boolean;
  onClose: (e: boolean) => void;
  onSubmitFile: (file: File) => void;
  isSubmitting: boolean;
}

const initialFile: FileState = {
  file: null,
  currentFile: '',
  isFileSelected: false,
  errorMessage: '',
  isDragActive: false,
};

export const ModalFileUpload: React.FC<ModalFileUpload> = ({ title, isOpen, onClose, onSubmitFile, isSubmitting }) => {
  const [fileState, dispatch] = useReducer(uploadReducer, initialFile);

  const onHandleFile = (upload: UploadState) => {
    dispatch({ type: convertToUploadAction(upload), fileState: convertToFileState(upload) });
  };

  const onAbort = () => {
    dispatch({ type: 'upload_file_reset', fileState: initialFile });
    onClose(false);
  };
  const onSubmit = () => {
    if (fileState.file !== null) {
      isSubmitting = true;
      onSubmitFile(fileState.file);
      onClose(false);
      isSubmitting = false;
    }
  };

  return (
    <div className={'absolute w-355 h-[400px]'}>
      <Modal title={title} isOpen={isOpen} onClose={() => onAbort()}>
        <div>
          <FileUpload
            hint="JPEG oder PNG, maximal 50 MB"
            label=""
            isFileSelected={fileState.isFileSelected}
            currentFile={fileState.currentFile}
            errorMessage={fileState.errorMessage}
            onAddFile={(f) => onHandleFile(f)}
          />
        </div>
        <div className={'flex flex-row gap-l justify-between py-l'}>
          <Button label="Abbrechen" size="L" variant="default" onClick={() => onAbort()}>
            <CancelIcon size={16} />
          </Button>
          <Button
            label="Speichern"
            size="L"
            variant="purple"
            isDisabled={fileState.errorMessage.length > 0 || isSubmitting}
            onClick={() => onSubmit()}
          >
            <CheckmarkIcon size={16} />
          </Button>
        </div>
      </Modal>
    </div>
  );
};
