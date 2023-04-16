import {
  Button,
  CancelIcon,
  CheckmarkIcon,
  FileUpload,
  Modal,
} from '@smartive-education/design-system-component-library-hello-world-team';
import React, { useState } from 'react';

interface ModalFileUpload {
  title: string;
  isOpen: boolean;
  onClose: (e: boolean) => void;
  onSubmitFile: (file: File) => void;
}

export const ModalFileUpload: React.FC<ModalFileUpload> = ({ title, isOpen, onClose, onSubmitFile }) => {
  const [tempfile, setTempfile] = useState<File | null>();

  const onAbort = () => {
    setTempfile(null);
    onClose(false);
  };
  const onSubmit = () => {
    if (tempfile) {
      onSubmitFile(tempfile);
      setTempfile(null);
      onClose(false);
    }
  };

  return (
    <div className={'absolute w-355 h-[400px]'}>
      <Modal title={title} isOpen={isOpen} onClose={() => onClose(false)}>
        <div>
          <FileUpload hint="JPEG oder PNG, maximal 50 MB" label="" onAddFile={(f) => setTempfile(f)} />
        </div>
        <div className={'flex flex-row gap-l justify-between py-l'}>
          <Button label="Abbrechen" size="L" variant="default" onClick={() => onAbort()}>
            <CancelIcon size={16} />
          </Button>
          <Button label="Speichern" size="L" variant="purple" onClick={() => onSubmit()}>
            <CheckmarkIcon size={16} />
          </Button>
        </div>
      </Modal>
    </div>
  );
};
