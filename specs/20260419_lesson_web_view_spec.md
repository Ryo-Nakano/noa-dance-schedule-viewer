# レッスン一覧 WebView

## 概要

- やりたいこと
  - `lessons` シートに格納されているレッスン一覧データを、GAS の Web アプリとしてブラウザ上で閲覧できる WebView を作成する。
  - `temp/sample_view.js` のプロトタイプ（React + Tailwind CSS）をベースに、実際のスプレッドシートデータを表示する本番用 WebView とする。
  - フィルタリング機能・レッスン詳細モーダル・公式サイトへの予約リンクを提供する。
- 背景・理由
  - `temp/sample_view.js` はダミーデータを用いたプロトタイプに留まっており、実際のスプレッドシートデータを表示できていない。
  - レッスンスケジュールを曜日・時間帯・ジャンル・レベル等で絞り込んで確認できる手段が現状ない。

---

## 仕様

### 機能要件

#### データ取得
- GAS バックエンドが `Lessons` DAO（`src/sheet_data/bound_sheet/lessons.js`）を使ってスプレッドシートから全レッスンを取得する。
- `doGet()` 内で `Lessons.all` を呼び出し、JSON 文字列（`JSON.stringify`）として HTML 内の `<script>` タグに埋め込む。
- フロントエンド（HTML 側）は `window.__LESSONS_DATA__` から初期データを読み込む。（追加の API 呼び出しは行わない）

#### フィールドの型定義

`Lessons.all` が返す各オブジェクトのフィールドは以下の型・フォーマットを前提とする。
これらは `json_upload_operation.js` でスプレッドシートに書き込まれた値を `getValues()` で読み返したものである。

| プロパティ | 型 | フォーマット・備考 |
|---|---|---|
| `lessonId` | Number | スプレッドシートの数値 |
| `date` | String | `YYYY/MM/DD` 形式（例: `"2026/04/21"`）。Upload 時に変換済み |
| `dayOfWeek` | String | `MON`/`TUE`/`WED`/`THU`/`FRI`/`SAT`/`SUN` の英語略称 |
| `startTime` | String | `HH:MM` 形式（例: `"12:00"`） |
| `endTime` | String | `HH:MM` 形式（例: `"13:25"`） |
| `storeName` | String | 店舗名 |
| `studioName` | String | スタジオ名 |
| `genre` | String | ジャンル名 |
| `level` | String | レベル名 |
| `instructorName` | String | インストラクター名 |
| `nickname` | String | ニックネーム |
| `isWomanOnly` | Number or String | `record.WOMAN_FLG` の値そのまま。空の場合は空文字 `""`。真の場合は数値（例: `1`）。フィルター判定では `Boolean(isWomanOnly)` の truthy/falsy で評価する |
| `isManOnly` | Number or String | `record.MAN_FLG` の値そのまま。`isWomanOnly` と同様 |
| `url` | String | 公式サイトの URL。空の場合は空文字 `""` |
| `instructorImageUrl` | String | インストラクター画像の URL。空の場合は空文字 `""` |

#### フィルタリング

以下のフィルター項目を提供する。同一カテゴリ内は OR 条件、カテゴリ間は AND 条件とする。

| フィルター項目 | DAO プロパティ | UI でのラベル | 選択肢の生成方法 |
|---|---|---|---|
| 曜日 | `dayOfWeek` | 月/火/水/木/金/土/日（日本語）| 固定順: MON→月, TUE→火, WED→水, THU→木, FRI→金, SAT→土, SUN→日 |
| 時間帯 | `startTime` | `10:00台` 等 | `startTime.split(':')[0]` で「時」を取得し、数値昇順で動的生成 |
| 店舗 | `storeName` | そのまま | データから動的生成、文字列昇順 |
| ジャンル | `genre` | そのまま | データから動的生成、文字列昇順 |
| レベル | `level` | そのまま | データから動的生成、文字列昇順 |
| 女性限定 | `isWomanOnly` | — | 後述「女性限定フィルター」を参照 |

#### 女性限定フィルター

- 選択肢は「指定しない（デフォルト）」「女性限定のみ表示」「女性限定を除く」の **3 択ラジオボタン**とする。
- フィルターモーダル内で、他のアコーディオンセクション（曜日・時間帯・店舗・ジャンル・レベル）と**同列のアコーディオンセクション**として「女性限定」という見出しで配置する。ただし内部はアコーディオン展開後にラジオボタンを表示する（チェックボックスではない）。
- 判定ロジック:
  - 「指定しない」: 全件通過
  - 「女性限定のみ表示」: `Boolean(item.isWomanOnly) === true` のものだけ通過
  - 「女性限定を除く」: `Boolean(item.isWomanOnly) !== true` のものだけ通過
- 「女性限定」フィルターは他のフィルターと AND 条件で結合する。
- `isManOnly` フィルターは今回のスコープ外とする。

#### 一覧表示

- フィルター適用後のレッスンを一覧表示する。
- **表示順**: スプレッドシートから取得した行順のまま変更しない。
- 件数を表示する（例：「20 件表示」）。
- 一覧の各行に表示する情報:
  - 曜日 (`dayOfWeek` を日本語ラベルで表示: MON→月, TUE→火, ... )
  - 開始〜終了時間 (`startTime` - `endTime`)
  - 店舗名 (`storeName`)・スタジオ名 (`studioName`)
  - インストラクター名 (`instructorName`)
  - ジャンル (`genre`)
  - レベル (`level`)

#### レッスン詳細モーダル

- 一覧の各行をタップ/クリックすると詳細モーダルを表示する。
- モーダルに表示する内容:
  - インストラクター画像 (`instructorImageUrl`) ※ 空文字の場合はプレースホルダーアイコン（User アイコン等）を表示する
  - インストラクター名 (`instructorName`) / ニックネーム (`nickname`)
  - ジャンル (`genre`) / レベル (`level`)
  - 日付 (`date`): そのまま文字列表示（例: `2026/04/21`）+ 曜日バッジ (`dayOfWeek` を日本語表示)
  - 時間 (`startTime` - `endTime`)
  - 店舗名 (`storeName`) / スタジオ名 (`studioName`)
  - 「公式サイトで予約・確認する」ボタン: `url` が空文字でない場合のみ表示する（`url === ""` の場合はボタン非表示）。表示する場合は `target="_blank"` で開く。

#### その他 UI

- ヘッダーに「NOA Viewer」タイトルを表示。
- フィルター操作は FAB（フローティングアクションボタン）から開くモーダルで行う（`temp/sample_view.js` に準拠）。
- 適用中のフィルター条件をヘッダー下部にバッジで表示し、タップで個別解除できる。
  - 女性限定フィルター（「女性限定のみ表示」または「女性限定を除く」が選択中）は、バッジとして表示し、タップで「指定しない」に戻す。

### UI/メッセージ

- アプリ読み込み中: 「データを読み込み中...」（`window.__LESSONS_DATA__` のパース前に表示）
- データなし（`Lessons.all` 結果が空）: 「データがありません」
- フィルター条件に一致なし: 「条件に一致するデータがありません」

### 制約・前提

- **実行環境**: Google Apps Script Web アプリ（`doGet()` で HTML を返す）
- **HTML の返却方式**: `HtmlService.createHtmlOutput(html)` で HTML 文字列を返す
- **フロントエンドフレームワーク**: React 18（CDN）+ Tailwind CSS Play CDN
- **データ受け渡し**:
  - `view.html` 内に `{{LESSONS_JSON_PLACEHOLDER}}` というプレースホルダー文字列を埋め込んでおく。
  - GAS バックエンドが `Lessons.all` の JSON 文字列でこのプレースホルダーを `String.replace()` で置換し、`<script>` タグ内の `window.__LESSONS_DATA__` に代入した状態として HTML を生成する。
  - GAS テンプレートエンジン（`HtmlTemplate`）は使用しない。
- **既存の関連機能/コード**:
  - `src/sheet_data/bound_sheet/lessons.js` (`Lessons` DAO)
  - `src/index.js` (エントリーポイント、`doGet()` を追加する)
  - `temp/sample_view.js` (フロントエンドの UI プロトタイプ)
- **使用する既存の DAO**: `Lessons`

---

## 実装計画

### 使用するクラス・ファイル

| 役割 | ファイル | 変更種別 |
|---|---|---|
| GAS Web アプリエントリー | `src/index.js` | 変更（`global.doGet` を追加） |
| WebView の HTML | `src/view.html` | 新規作成 |
| データ取得 Operation | `src/operations/get_lessons_web_view_operation.js` | 新規作成 |
| DAO | `src/sheet_data/bound_sheet/lessons.js` | 変更なし |
| ビルド設定 | `vite.config.js` | 変更（`view.html` を `dist/` へコピー） |
| GAS 設定 | `appsscript.json` | 変更（`webapp.access: ANYONE_ANONYMOUS`, `webapp.executeAs: USER_DEPLOYING`） |
| デプロイスクリプト | `package.json` | 変更（`config.deployId` に deploy ID を定義し、`deploy` スクリプトで `$npm_package_config_deployId` を使って参照） |

### 処理フロー

1. ユーザーが WebView の URL にアクセスする
2. GAS が `doGet()` を実行する
3. `doGet()` が `GetLessonsWebViewOperation` を実行する
4. Operation が `Lessons.all` でスプレッドシートからデータを取得し、HTML 文字列（`view.html` の内容）の `{{LESSONS_JSON_PLACEHOLDER}}` を `JSON.stringify(Lessons.all)` で置換した文字列を返す
5. `doGet()` が返された HTML 文字列を `HtmlService.createHtmlOutput(html)` に渡して `HtmlOutput` を返す
6. ブラウザが HTML をレンダリングし、React が `window.__LESSONS_DATA__` を読み込んで一覧を描画する

### `GetLessonsWebViewOperation` の責務

- `_operation()` の戻り値: `HtmlService.createHtmlOutput(html)` で生成した `HtmlOutput` オブジェクト
- 内部処理:
  1. `DriveApp` 等 **は使わず** `HtmlService.createHtmlOutputFromFile('view')` を使って `view.html` を読み込む（GAS 標準の HTML ファイル読み込み方式）
  2. ただし `HtmlTemplate` としてではなく、一旦 `.getContent()` でテキストとして取得する
  3. `content.replace('{{LESSONS_JSON_PLACEHOLDER}}', JSON.stringify(Lessons.all))` で置換する
  4. `HtmlService.createHtmlOutput(content)` で `HtmlOutput` を生成して返す
- `doGet()` は Operation の戻り値（`HtmlOutput`）をそのまま `return` する

### 技術的な判断・注意点

- **React/Tailwind の CDN 利用**: GAS の CSP 制約のため、`HtmlService.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)` の設定が必要になる可能性がある。React 18 と Tailwind CSS Play CDN を `<script>` タグで CDN から読み込む。
- **`{{LESSONS_JSON_PLACEHOLDER}}` の安全性**: JSON 文字列中に `</script>` 等が含まれる場合、HTML が破壊される恐れがある。`JSON.stringify` の結果を `replace(/</g, '\\u003c')` 等でエスケープする対応を検討すること。
- **`npm run deploy` 変更**: 現状は `vite build && clasp push` のみ。deploy ID はコマンドに直書きせず `package.json` の `config` セクションに定義し、`$npm_package_config_deployId` で参照する。最終的な設定は以下とする:
  ```json
  "config": {
    "deployId": "AKfycbxUCtfScdnVEuYtRc_Gqn1i9G-RtZpBFsyZKzZdRjf0ceCaEAEjCmBMQ_k_V3MOyr48NQ"
  },
  "scripts": {
    "deploy": "vite build && clasp push && clasp deploy --deploymentId $npm_package_config_deployId"
  }
  ```
  ※ `$npm_package_config_*` は npm がスクリプト実行時に自動で展開する（Linux/Mac のみ）。
- **女性限定フィルターの `isWomanOnly` 値**: `json_upload_operation.js` で `record.WOMAN_FLG` をそのまま書き込んでいるため、API が返す値（数値 `1` または空文字 `""`）がそのまま格納される。フィルター判定は `Boolean(item.isWomanOnly)` の truthy/falsy を使う。
- **`HtmlService.createHtmlOutputFromFile` の利用**: GAS では `HtmlService.createHtmlOutputFromFile('view')` で `dist/view.html` を読み込める（拡張子 `.html` は不要）。この時、`clasp push` によって `dist/view.html` が GAS プロジェクトに含まれていることが前提。
