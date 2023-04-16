export const initialWriteState = {
  formInputError: '',
  form: {
    file: null,
    textInput: '',
    textInputError: '',
  },
};

export type WriteState = {
  formInputError: string;
  form: {
    file: File | null;
    textInput: string;
    textInputError: string;
  };
};
