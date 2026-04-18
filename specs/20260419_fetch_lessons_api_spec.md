# NOAダンススケジュール API データ取得処理 (FetchLessonsApiOperation)

## 概要
- やりたいこと: NOAダンスアカデミーの予約APIへリクエストを送信し、レッスン一覧データのJSONを取得して呼び出し元へ戻す機能を提供する。
- 背景・理由: 既存の実装では「API取得」と「スプレッドシート適用」が一つの処理として結合されていた。Operationの責務を分離し、保守性と独立性を高めるため、このクラスは「データの取得」のみに専念させる。

## 仕様
### 機能要件
- UIのトリガーには直接紐付かず、親となる統合Operation（非表示処理として）から呼び出される。
- NOA予約APIに対して指定された固定パラメータ（location, genre, brand, is_month）で `POST` リクエストを送る。
- 取得したレスポンスデータ（オブジェクト、もしくはJSON文字列）をそのまま呼び出し元へ戻す。

### UI/メッセージ
- UIに関わる機能（確認・完了ダイアログ等）は一切持たず、メッセージ出力は行わない。

### 制約・前提
- 既存の関連機能/コード:
  - `src/api_clients/noa_api_client.js` で定義された `NOA_API` エンドポイント定義を利用する。

## 実装計画
### 使用するクラス・ファイル
- **[MODIFY]** Operation: `src/operations/fetch_lessons_api_operation.js`

### 処理フロー
1. 他のOperationから `_operation()` などで実行される。
2. `NoaApiClient` のインスタンスを生成し、`request(NOA_API.lessons.fetch(...))` でAPIを叩く。
3. リクエストステータスが正常(200)の場合、レスポンスのオブジェクトデータを `return` で呼び出し元に返す。
4. ステータス異常やデータが取得できなかった場合は、例外(`throw new Error`)を発生させ、エラーハンドリングを親に委ねる。

### 技術的な判断・注意点
- なぜこのアプローチを選んだか: このOperationの役割を単一の「JSONのFetch」に絞るため。
