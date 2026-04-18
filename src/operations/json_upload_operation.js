import { BaseOperation } from "@/base_classes/base_operation";

export class JsonUploadOperation extends BaseOperation {
  /**
   * @param {string} jsonString - クライアントから送信されたJSON文字列
   */
  constructor(jsonString) {
    super();
    this.jsonString = jsonString;
  }

  _operation() {
    try {
      const parsedData = JSON.parse(this.jsonString);
      
      // データ構造の検証
      if (!parsedData || !parsedData.body || !parsedData.body.Items) {
        return { status: "error", message: "対象のデータが抽出できませんでした。JSON構造が異なる可能性があります。" };
      }

      const items = parsedData.body.Items;
      const dataArray = [];

      // パースとマッピング
      for (const item of items) {
        const youbi = item.YOUBI || "";
        const timeList = item.time_list;
        
        if (!timeList || !Array.isArray(timeList)) continue;

        for (const slot of timeList) {
          const records = slot.record;
          
          if (!records || !Array.isArray(records)) continue;

          for (const record of records) {
            // YYYYMMDD -> YYYY/MM/DD 変換
            let formattedDate = "";
            if (record.HIDUKE && record.HIDUKE.length === 8) {
              formattedDate = `${record.HIDUKE.substring(0, 4)}/${record.HIDUKE.substring(4, 6)}/${record.HIDUKE.substring(6, 8)}`;
            } else {
              formattedDate = record.HIDUKE || "";
            }

            const row = [
              record.SEQ || "",
              formattedDate,
              youbi,
              record.Y_TIME_START || "",
              record.Y_TIME_END || "",
              record.TENPO_NAME || "",
              record.STUDIO_NAME || "",
              record.GENRE_SUB_NAME || "",
              record.LEVEL_NAME || "",
              record.INSTRUCTOR_NAME || "",
              record.NICKNAME || "",
              record.WOMAN_FLG !== undefined && record.WOMAN_FLG !== null ? record.WOMAN_FLG : "",
              record.MAN_FLG !== undefined && record.MAN_FLG !== null ? record.MAN_FLG : "",
              record.URL || "",
              record.INSTRUCTOR_IMG || ""
            ];
            
            dataArray.push(row);
          }
        }
      }

      const sheet = this._getSheet("lessons");
      if (!sheet) {
        return { status: "error", message: "「lessons」シートが見つかりません。事前にシートを作成してください。" };
      }

      // 既存データのクリア (ヘッダー行は残す)
      const lastRow = sheet.getLastRow();
      if (lastRow >= 2) {
        sheet.getRange(2, 1, lastRow - 1, 15).clearContent();
        SpreadsheetApp.flush();
      }

      // データ書き込み
      if (dataArray.length > 0) {
        sheet.getRange(2, 1, dataArray.length, 15).setValues(dataArray);
      }

      return { status: "success", count: dataArray.length };

    } catch (e) {
      if (e instanceof SyntaxError) {
        return { status: "error", message: "不正な形式のJSONファイルです。内容をご確認ください。" };
      }
      return { status: "error", message: `サーバー処理エラー: ${e.message}` };
    }
  }
}
