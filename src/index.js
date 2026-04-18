import { CreateMenuOperation } from '@/operations/create_menu_operation.js';
import { OpenUploadDialogOperation } from '@/operations/open_upload_dialog_operation.js';
import { CreateHeaderOperation } from '@/operations/create_header_operation.js';
import { JsonUploadOperation } from '@/operations/json_upload_operation.js';

global.onOpen = () => {
  const operation = new CreateMenuOperation();
  operation.run();
};

global.createLessonsHeaderOperation = () => {
  const operation = new CreateHeaderOperation();
  operation.run();
};

global.openUploadDialogOperation = () => {
  const operation = new OpenUploadDialogOperation();
  operation.run();
};

global.processJsonUploadOperation = (jsonString) => {
  const operation = new JsonUploadOperation(jsonString);
  return operation.run();
};
