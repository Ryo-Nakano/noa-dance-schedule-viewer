import { BaseOperation } from '@/base_classes/base_operation';
import { Lessons } from '@/sheet_data/bound_sheet/lessons.js';

/**
 * レッスン一覧 WebViewを表示するための HTML を生成・返却する Operation
 */
export class GetLessonsWebViewOperation extends BaseOperation {
  /**
   * @override
   */
  _operation() {
    // 1. view.html の内容を読み込む
    // clasp push によって dist/view.html が GAS プロジェクトに含まれている前提
    const htmlOutput = HtmlService.createHtmlOutputFromFile('view');
    let content = htmlOutput.getContent();

    // 2. レッスンデータを取得して JSON 文字列化
    const lessonsData = Lessons.all;
    const jsonString = JSON.stringify(lessonsData)
      .replace(/</g, '\\u003c')
      .replace(/>/g, '\\u003e');

    // 3. プレースホルダーを置換
    content = content.replace('{{LESSONS_JSON_PLACEHOLDER}}', jsonString);

    // 4. HtmlOutput を再生成して設定を適用
    const finalOutput = HtmlService.createHtmlOutput(content);
    finalOutput
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setTitle('NOA Lesson Schedule Viewer')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);

    return finalOutput;
  }
}
