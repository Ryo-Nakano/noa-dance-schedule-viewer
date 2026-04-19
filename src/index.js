import { CreateMenuOperation } from '@/operations/create_menu_operation.js';
import { OpenUploadDialogOperation } from '@/operations/open_upload_dialog_operation.js';
import { CreateHeaderOperation } from '@/operations/create_header_operation.js';
import { JsonUploadOperation } from '@/operations/json_upload_operation.js';
import { UpdateLessonsOperation } from '@/operations/update_lessons_operation.js';
import { TestOperation } from '@/operations/test_operation.js';
import { GetLessonsWebViewOperation } from '@/operations/get_lessons_web_view_operation.js';

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

global.updateLessonsOperation = () => {
  const operation = new UpdateLessonsOperation();
  operation.run();
};

global.TEST = () => {
  const operation = new TestOperation();
  operation.run();
};

/**
 * Web アプリのエントリーポイント
 */
global.doGet = (e) => {
  const operation = new GetLessonsWebViewOperation();
  return operation.run();
};
