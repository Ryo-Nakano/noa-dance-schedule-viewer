import { BaseOperation } from "@/base_classes/base_operation";

export class OpenUploadDialogOperation extends BaseOperation {
  _operation() {
    const html = HtmlService.createHtmlOutputFromFile('dialog')
      .setTitle('JSONアップロード')
      .setWidth(350)
      .setHeight(200);
    SpreadsheetApp.getUi().showModalDialog(html, 'JSONアップロード');
  }
}
