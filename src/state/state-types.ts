import { Mumble, Reply, User } from '../services/service-types';

export type CardForm = {
  file?: File | null;
  filename?: string;
  comment?: string;
  commentError?: string;
};

export type CardState = {
  form: {
    file: File | null;
    filename: string;
    comment: string;
    commentError: string;
  };
  mumble: Mumble;
  showComments?: boolean;
  copiedActive: boolean;
  isSubmitting: boolean;
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
  form: {
    file: File | null;
    filename?: string;
    textInput: string;
    textInputError: string;
  };
  isSubmitting: boolean;
};

export type MumblePageState = {
  mumble: Mumble;
  replies: Reply[];
};

export type FileData = {
  file: File | null;
  filename?: string;
};
