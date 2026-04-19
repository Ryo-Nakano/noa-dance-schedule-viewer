import { BoundSheetData } from "@/base_classes/base_sheet_data";
import { BOUND_SHEETS, NAMED_RANGES } from "@/constants";

/**
 * lessonsシートへのデータアクセスを提供するクラス
 */
export class Lessons extends BoundSheetData {
  /**
   * 全データを取得します（ヘッダー行はスキップ、IDが空の行は除外）
   * @returns {Array<Object>} 不変（frozen）なオブジェクトの配列
   */
  static get all() {
    const get = () => {
      const sheet = this._getSheet(BOUND_SHEETS.LESSONS);
      if (!sheet) return [];

      const rawData = sheet.getDataRange().getValues();
      if (rawData.length <= 1) return []; // ヘッダーのみ、または空の場合

      const data = rawData.slice(1);
      const cols = this._getNamedRangeColsOf(sheet);

      // ID列のインデックスを取得（1-indexedなので -1 する）
      const idColIndex = cols[NAMED_RANGES.BOUND_SHEETS.LESSONS.ID] - 1;

      return data
        .filter(row => !!row[idColIndex]) // lessonId が Falsy な行を除外
        .map(row => {
          return Object.freeze({
            lessonId: row[cols[NAMED_RANGES.BOUND_SHEETS.LESSONS.ID] - 1],
            date: row[cols[NAMED_RANGES.BOUND_SHEETS.LESSONS.DATE] - 1],
            dayOfWeek: row[cols[NAMED_RANGES.BOUND_SHEETS.LESSONS.DAY_OF_WEEK] - 1],
            startTime: this._formatTime(row[cols[NAMED_RANGES.BOUND_SHEETS.LESSONS.START_TIME] - 1]),
            endTime: this._formatTime(row[cols[NAMED_RANGES.BOUND_SHEETS.LESSONS.END_TIME] - 1]),
            storeName: row[cols[NAMED_RANGES.BOUND_SHEETS.LESSONS.STORE_NAME] - 1],
            studioName: row[cols[NAMED_RANGES.BOUND_SHEETS.LESSONS.STUDIO_NAME] - 1],
            genre: row[cols[NAMED_RANGES.BOUND_SHEETS.LESSONS.GENRE] - 1],
            level: row[cols[NAMED_RANGES.BOUND_SHEETS.LESSONS.LEVEL] - 1],
            instructorName: row[cols[NAMED_RANGES.BOUND_SHEETS.LESSONS.INSTRUCTOR_NAME] - 1],
            nickname: row[cols[NAMED_RANGES.BOUND_SHEETS.LESSONS.NICKNAME] - 1],
            isWomanOnly: row[cols[NAMED_RANGES.BOUND_SHEETS.LESSONS.IS_WOMAN_ONLY] - 1],
            isManOnly: row[cols[NAMED_RANGES.BOUND_SHEETS.LESSONS.IS_MAN_ONLY] - 1],
            url: row[cols[NAMED_RANGES.BOUND_SHEETS.LESSONS.URL] - 1],
            instructorImageUrl: row[cols[NAMED_RANGES.BOUND_SHEETS.LESSONS.INSTRUCTOR_IMAGE_URL] - 1],
          });
        });
    };

    this._allCache = this._allCache || get();
    return this._allCache;
  }

  /**
   * キャッシュをクリアします
   */
  static clearCache() {
    this._allCache = null;
    this._sheetCache = null;
    this._namedRangeColsCache = null;
  }

  /**
   * 時刻値を HH:mm 形式の文字列に変換します
   * @param {Date|string} value 時刻値
   * @returns {string} フォーマットされた時刻文字列
   * @private
   */
  static _formatTime(value) {
    if (value instanceof Date) {
      const hours = value.getHours().toString().padStart(2, "0");
      const minutes = value.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }
    return value;
  }
}
