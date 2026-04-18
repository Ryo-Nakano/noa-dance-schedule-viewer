# レッスン情報更新 統合処理 (UpdateLessonsOperation)

## 概要
- やりたいこと: カスタムメニューの「最新データを取得」から呼び出され、APIからのレッスンデータ取得とスプレッドシートへの適用を順次実行してデータを一括で最新化する。
- 背景・理由: Operationの責務を「取得(Fetch)」「適用(Upload)」に完全に分離したアーキテクチャの下で、それらを組み立ててエンドユーザーの一連の体験として繋ぎ合わせるため。

## 仕様
### 機能要件
- スプレッドシートのカスタムメニュー「最新データを取得」のクリックで発火する。
- 内部で `FetchLessonsApiOperation` を用いて、APIからJSONデータを取得する。
- 次に、取得したデータを内部で `JsonUploadOperation` インスタンスに渡して、スプレッドシートの `lessons` シートに書き込む。

### UI/メッセージ
- メニュー名: 最新データを取得
- 確認メッセージ: なし
- 完了メッセージ: 「XXX件のレッスンデータをAPIから取得し、反映しました。」（各実行結果を統合して返却）
- エラーメッセージ: 子Operationから上がってきた例外は全てキャッチせず上へ流し、大元の `BaseOperation` の機能で一元的にエラーダイアログを表示させる。

### 制約・前提
- 既存の関連機能/コード:
  - API通信は `FetchLessonsApiOperation` を利用する。
  - シート適用は `JsonUploadOperation` を利用する。

## 実装計画
### 使用するクラス・ファイル
- **[NEW]** Operation: `src/operations/update_lessons_operation.js`
- **[MODIFY]** `src/index.js` (グローバル関数 `global.updateLessonsOperation` の追加。既存の `fetchLessonsApiOperation` はUIトリガーとしては不要になれば削除するが、Operationファイル自体は残す)
- **[MODIFY]** `src/operations/create_menu_operation.js` (カスタムメニューのフック先を `updateLessonsOperation` に変更)

### 処理フロー
1. ユーザーが「最新情報を取得」を実行する。
2. `src/index.js` の `updateLessonsOperation` を経由し、 `UpdateLessonsOperation` が呼び出される(run)。
3. `UpdateLessonsOperation._operation()` が実行される。
4. 中で `new FetchLessonsApiOperation()` を作成し、その `_operation()` を呼んでJSONデータ（または文字列）を受け取る。
5. 受け取ったJSON文字列を引数に `new JsonUploadOperation(jsonString)` を作成し、その `_operation()` を呼んでスプレッドシートに適用する。
6. 全ての手続きが正常に完了したら、最終的な完了メッセージを構築して戻り値とし、BaseOperationにUI通知させる。

### 技術的な判断・注意点
- 責務の分離によるテスト・保守性の向上。各コンポーネント（Fetch, Upload）は独立して動かせるためコードが理解しやすくなる。
