# JSONアップロード時のシート反映の確実化

## 概要
- `JsonUploadOperation` において、既存データの `clearContent()` を実行した直後に `SpreadsheetApp.flush()` を実行するように変更します。
- 背景: 大量のデータを書き換える際、既存データのクリアが確実に反映されてから次の書き込みが行われるようにすることで、実行順序の不整合や表示上の遅延を防ぐためです。

## 仕様
### 機能要件
- `lessons` シートの既存データをクリアした直後、`SpreadsheetApp.flush()` を実行し、変更を即座に反映させる。

### UI/メッセージ
- 変更なし

### 制約・前提
- `JsonUploadOperation` クラス（`src/operations/json_upload_operation.js`）が対象。
- Google Apps Script の `SpreadsheetApp.flush()` を使用する。

## 実装計画
### 使用するクラス・ファイル
- Operation: `src/operations/json_upload_operation.js`

### 処理フロー
1. `src/operations/json_upload_operation.js` を開く。
2. `sheet.getRange(2, 1, lastRow - 1, 15).clearContent();` の直後に `SpreadsheetApp.flush();` を追加する。

### 技術的な判断・注意点
- `SpreadsheetApp.flush()` は同期を強制するため、パフォーマンスに若干の影響を与える可能性があるが、データの整合性と画面表示の正確性を優先する。
