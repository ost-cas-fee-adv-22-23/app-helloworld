import { UploadState } from '@smartive-education/design-system-component-library-hello-world-team';
import { Mumble } from '../services/service-types';
import { FileState } from '../state/state-types';

export function convertToFileState(upload: UploadState): FileState {
  return {
    file: upload?.file,
    currentFile: upload.currentFile,
    isFileSelected: upload.isFileSelected,
    isDragActive: upload.isDragActive,
    errorMessage: upload.errorMessage,
  };
}

export function convertToUploadAction(upload: UploadState) {
  switch (upload.type) {
    case 'upload_drag_active': {
      return 'upload_drag_active';
    }
    case 'upload_drag_leave': {
      return 'upload_drag_leave';
    }
    case 'upload_error_files': {
      return 'upload_error_files';
    }
    case 'upload_error_max_size': {
      return 'upload_error_max_size';
    }
    case 'upload_error_wrong_type': {
      return 'upload_error_wrong_type';
    }
    case 'upload_file_reset': {
      return 'upload_file_reset';
    }
    case 'upload_file_success': {
      return 'upload_file_success';
    }
    default:
      return 'upload_file_reset';
  }
}

export function convertToMumble(data: any): Mumble {
  return {
    id: data.id,
    creator: data.creator,
    creatorProfile: data.creatorProfile,
    text: data.text,
    mediaUrl: data.mediaUrl,
    mediaType: data.mediaType,
    likeCount: data.likeCount,
    likedByUser: data.likedByUser,
    type: data.type,
    replyCount: data.replyCount,
    createdTimestamp: data.createdTimestamp,
    createdDate: data.createdDate,
  };
}
