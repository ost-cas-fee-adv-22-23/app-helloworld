import {
  Button,
  CancelIcon,
  CheckmarkIcon,
  FileUpload,
  Modal,
} from '@smartive-education/design-system-component-library-hello-world-team';
import React from 'react';

interface ModalFileUpload {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ModalFileUpload: React.FC<ModalFileUpload> = ({ title, isOpen, onClose }) => {
  return (
    <div className={'absolute w-355 h-[400px]'}>
      <Modal title={title} isOpen={isOpen} onClose={onClose}>
        <div>
          <FileUpload hint="JPEG oder PNG, maximal 50 MB" label="Form Upload" />
        </div>
        <div className={'flex flex-row gap-l justify-between py-l'}>
          <Button label="Abbrechen" size="L" variant="default" onClick={(e) => onFileAbort(e)}>
            <CancelIcon size={16} />
          </Button>
          <Button label="Speichern" size="L" variant="purple" onClick={(e) => onFileSubmit(e)}>
            <CheckmarkIcon size={16} />
          </Button>
        </div>
      </Modal>
    </div>
  );
};
