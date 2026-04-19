# ジャンル絞り込み機能の改修 (genreLabel対応)

## 概要
- レッスンの絞り込み機能において、従来の `genre` フィールドではなく、新しく追加された `genreLabel` フィールドを使用して絞り込みを行うように変更する。
- データの多様性や表記揺れに対応するため、より表示に適した `genreLabel` を絞り込みの基準とする。

## 仕様
### 機能要件
- 絞り込みモーダルの「ジャンル」セクションの選択肢が `genreLabel` の値から生成されるようになる。
- 選択されたジャンルによるフィルタリング処理が、レッスンの `genreLabel` フィールドを対象に行われるようになる。
- 詳細画面での表示については、従来通り `genre` フィールドの値を使用する。
- 一覧画面での表示についても `genre` フィールド（あるいは `genreLabel` との整合性を考慮した適切な値）を使用する。

### UI/メッセージ
- 特になし。既存のUI構成を維持し、内部的なデータ参照先と表示文字を変更する。

### 制約・前提
- `src/sheet_data/bound_sheet/lessons.js` に `genreLabel` が既に追加されていること（確認済み）。
- `src/constants.js` に `NAMED_RANGES.BOUND_SHEETS.LESSONS.GENRE_LABEL` が定義されていること（確認済み）。
- `genreLabel` が空の場合は、従来の `genre` をフォールバックとして使用するか、あるいは空として扱う。本対応では `genreLabel` を優先する。

## 実装計画
### 使用するクラス・ファイル
- View: `src/view.html`

### 処理フロー
1. `src/view.html` 内の `App` コンポーネントにて、`filterOptions` の抽出ロジックを変更し、`item.genre` の代わりに `item.genreLabel` を使用する。
2. `filteredData` のフィルタリングロジックを変更し、`item.genre` の代わりに `item.genreLabel` で判定を行う。
3. レッスンカードおよび詳細モーダル内でのジャンル表示を `item.genreLabel` に変更する。

### 技術的な判断・注意点
- `genreLabel` が定義されていない古いデータや不備がある場合に備え、`item.genreLabel || item.genre` のようにフォールバックを持たせることを検討する。
- ユーザーの指示は「genreLabel の値で絞り込みするように変更」であるため、フィルタの基となるデータソースを完全に切り替える。
