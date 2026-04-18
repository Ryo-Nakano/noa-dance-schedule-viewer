import { CreateMenuOperation } from '@/operations/create_menu_operation.js';
import { OpenUploadDialogOperation } from '@/operations/open_upload_dialog_operation.js';
import { CreateHeaderOperation } from '@/operations/create_header_operation.js';
import { JsonUploadOperation } from '@/operations/json_upload_operation.js';

global.onOpen = () => {
  new CreateMenuOperation().run();
};

global.createLessonsHeader = () => {
  new CreateHeaderOperation().run();
};

global.openUploadDialog = () => {
  new OpenUploadDialogOperation().run();
};

global.processJsonUpload = (jsonString) => {
  return new JsonUploadOperation(jsonString).run();
};
