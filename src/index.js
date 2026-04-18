import { JsonUploadOperation } from '@/operations/json_upload_operation.js';
import { CreateHeaderOperation } from '@/operations/create_header_operation.js';

global.onOpen = (e) => {
  const ui = SpreadsheetApp.getUi();
  
  // ユーザー向けメニュー
  ui.createMenu('カンタン操作')
    .addItem('JSONデータをアップロード', 'openUploadDialog')
    .addToUi();
    
  // 開発者向けメニュー
  ui.createMenu('DeveloperTools')
    .addItem('lessons にヘッダー行を作成', 'createLessonsHeader')
    .addToUi();
};

global.createLessonsHeader = () => {
  const operation = new CreateHeaderOperation();
  try {
    operation.run();
    SpreadsheetApp.getUi().alert('ヘッダー行の作成が完了しました。');
  } catch (error) {
    if (error.message.includes('「lessons」シートが見つかりません')) {
      SpreadsheetApp.getUi().alert(error.message);
    } else {
      SpreadsheetApp.getUi().alert('エラーが発生しました: ' + error.message);
    }
  }
};

global.openUploadDialog = () => {
  const html = HtmlService.createHtmlOutputFromFile('dialog')
    .setTitle('JSONアップロード')
    .setWidth(350)
    .setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(html, 'JSONアップロード');
};

global.processJsonUpload = (jsonString) => {
  const operation = new JsonUploadOperation(jsonString);
  return operation.run();
};
