import { BaseOperation } from "@/base_classes/base_operation";

export class CreateMenuOperation extends BaseOperation {
  _operation() {
    const ui = SpreadsheetApp.getUi();

    // ユーザー向けメニュー
    ui.createMenu('カンタン操作')
      .addItem('最新データを取得', 'updateLessonsOperation')
      .addItem('JSONデータを手動アップロード', 'openUploadDialogOperation')
      .addToUi();

    // 開発者向けメニュー
    ui.createMenu('DeveloperTools')
      .addItem('lessons にヘッダー行を作成', 'createLessonsHeaderOperation')
      .addToUi();
  }
}
