import { BaseOperation } from "@/base_classes/base_operation";

export class CreateMenuOperation extends BaseOperation {
  _operation() {
    const ui = SpreadsheetApp.getUi();

    // ユーザー向けメニュー
    ui.createMenu('カンタン操作')
      .addItem('JSONデータをアップロード', 'openUploadDialog')
      .addToUi();

    // 開発者向けメニュー
    ui.createMenu('DeveloperTools')
      .addItem('lessons にヘッダー行を作成', 'createLessonsHeader')
      .addToUi();
  }
}
