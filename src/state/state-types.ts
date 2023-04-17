import { Mumble, User } from '../services/service-types';

export type CardState = {
  comment: string;
  mumble: Mumble;
  showComments?: boolean;
};

export type FileState = {
  file: File | null;
  currentFile: string;
  isFileSelected: boolean;
  isDragActive: boolean;
  errorMessage: string;
};

export type ListState = {
  mumbles: Mumble[];
  nextOffset: number;
  showWriteCard: boolean;
  totalMumbles: number;
  users: User[];
};

export type WriteState = {
  formInputError: string;
  form: {
    file: File | null;
    filename?: string;
    textInput: string;
    textInputError: string;
  };
  isSubmitting: boolean;
};

export type FileData = {
  file: File | null;
  filename?: string;
};
