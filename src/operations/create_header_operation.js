import { BaseOperation } from "@/base_classes/base_operation";

export class CreateHeaderOperation extends BaseOperation {
  _operation() {
    const sheet = this._getSheet("lessons");
    
    // シートが見つからない場合はエラーを投げる
    if (!sheet) {
      throw new Error("「lessons」シートが見つかりません。事前にシートを作成してください。");
    }

    const headers = [
      "レッスンID",
      "日付",
      "曜日",
      "開始時間",
      "終了時間",
      "店舗名",
      "スタジオ名",
      "ジャンル",
      "レベル",
      "インストラクター名",
      "ニックネーム",
      "女性限定",
      "男性限定",
      "URL",
      "インストラクター画像"
    ];

    // 1行目にヘッダーを上書き
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    return true; // 成功を表すためにtrueを返す
  }
}
