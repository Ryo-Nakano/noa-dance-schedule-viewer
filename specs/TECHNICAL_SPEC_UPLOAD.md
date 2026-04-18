# JSONアップロード処理 詳細設計書

## 1. 概要
カスタムメニューからアップロードされたノアダンスアカデミーのJSONデータ（スケジュール情報）を解析し、スプレッドシート（コンテナバインド）上の `lessons` シートへ表形式で展開・上書き保存する処理の詳細な実装仕様を定義する。
※本設計はデータのアップロードと蓄積にのみ焦点を当てており、エンドユーザー向けのビューワー機能の設計は含まない。

## 2. システム構成・ファイル構造
本処理は、対象となるスプレッドシートに直接紐づく「コンテナバインドスクリプト」として実装する。

| ファイル名 | 役割 | 備考 |
| --- | --- | --- |
| `Code.gs` | サーバーサイド処理 | メニュー構築、データパース、スプレッドシート一括書き込みのロジック |
| `dialog.html` | クライアントサイドUI | HTML/CSS/JSによる、ファイル選択と送信のモーダルダイアログ |

## 3. 動作フローと関数定義

### 3.1 サーバーサイドロジック (`Code.gs`)

#### `onOpen(e)`
*   **処理内容**: スプレッドシートを開いた際に実行されるシンプルトリガー関数の実装。
*   **詳細**: `SpreadsheetApp.getUi()` を使用して、カスタムメニュー「設定（仮）」などを作成し、その配下に「JSONデータをアップロード」というメニュー項目を追加する。このメニューをクリックした際に `openUploadDialog()` を呼び出すようバインドする。

#### `openUploadDialog()`
*   **処理内容**: アップロード用のUI（モーダル）を表示する。
*   **詳細**: `HtmlService.createHtmlOutputFromFile('dialog')` を使用して `dialog.html` を評価する。ダイアログのタイトルを「JSONアップロード」、サイズを縦横 `300px` ✕ `150px` 程度に適切に設定し、`SpreadsheetApp.getUi().showModalDialog()` を実行する。

#### `processJsonUpload(jsonString)`
*   **処理内容**: フロントエンドから送信されたJSON文字列を解析し、シートへ書き込む。
*   **引数**: `jsonString` (String) - 読み込まれたJSONファイルのテキストデータ。
*   **戻り値**: 成功時は `{ status: "success", count: number }`、失敗時は `{ status: "error", message: string }` 形式のオブジェクトを返す。
*   **詳細処理フロー**:
    1.  `JSON.parse(jsonString)` で文字列をオブジェクトに変換（失敗時は例外をキャッチし、エラー情報を返す）。
    2.  `Object.keys(parsedData.body.Items).length` 等で構造が正しいか検証。
    3.  データ抽出ループ: `body.Items[]` -> `time_list[]` -> `record[]` の順にネストされた配列を走査。
    4.  途中の配列が空または存在しない場合はスキップ。
    5.  後述の「4. データマッピング定義」に従い、抽出した値を1行分の配列（1D Array）にし、全体を二次元配列（2D Array）としてまとめる。日付（`YYYYMMDD`）は `YYYY/MM/DD` に変換し、値が存在しないプロパティは空文字列 `""` とする。
    6.  書き込み処理:
        *   `SpreadsheetApp.getActiveSpreadsheet().getSheetByName('lessons')` を取得。存在しない場合はエラーオブジェクトを返す。
        *   `sheet.getLastRow()` を取得し、2行目以降にデータが存在する場合、`sheet.getRange(2, 1, lastRow - 1, 15).clearContent()` を実行して既存の値をクリア（セルの書式や罫線は維持）。
        *   二次元配列が空でない場合、`sheet.getRange(2, 1, dataArray.length, 15).setValues(dataArray)` で一括書き込みを実行。
    7.  書き込み件数を数え、成功レスポンスを返す。

### 3.2 クライアントサイドUI (`dialog.html`)

*   **UI構成**:
    *   `<input type="file" id="jsonFile" accept=".json">` : JSONファイル選択用インプット。
    *   `<button id="uploadBtn">アップロード</button>` : 送信トリガーボタン。
    *   `<div id="statusMessage"></div>` : 進行状況や処理結果の表示領域。
*   **JS処理ロジック**:
    1.  「アップロード」ボタンのクリックイベントをリッスン。
    2.  ファイルが選択されていない場合はアラートまたはステータス領域に警告を表示し中断。
    3.  `FileReader` API の `readAsText()` を呼び出し、ファイル内容をテキストとして非同期で読み込む。
    4.  処理開始と同時に、表示を「処理中...」とし、ボタンを非活性（無効化）にする。
    5.  読込完了時の `onload` イベント内で、`google.script.run` を呼び出す。
        *   `.withSuccessHandler(onSuccess)`: 成功結果（`X件のデータを更新しました`等）をステータス領域に表示し、ダイアログを自動、もしくは閉じるボタンのみ活性化など状態変更する。
        *   `.withFailureHandler(onFailure)`: 予期せぬ例外等の通信エラー時にメッセージを表示し、ボタンを再度活性化する。
        *   `.processJsonUpload(textData)`: 実際のサーバーへの処理依頼。

## 4. データマッピング詳細定義

JSONデータの対象階層 `body.Items[].time_list[].record[]` を展開し、各レコード1件をスプレッドシートの1行として出力する。

| 列番号 | 列 (Col) | 出力項目名（想定ヘッダー） | 抽出元 JSONパス | 備考・フォーマット |
| --- | --- | --- | --- | --- |
| 1 | A列 | レッスンID | `record[].SEQ` | 数値 |
| 2 | B列 | 日付 | `record[].HIDUKE` | `YYYYMMDD` → `YYYY/MM/DD` に置換 |
| 3 | C列 | 曜日 | `Items[].YOUBI` | 親階層(`Items`)から取得 |
| 4 | D列 | 開始時間 | `record[].Y_TIME_START` | `HH:MM` |
| 5 | E列 | 終了時間 | `record[].Y_TIME_END` | `HH:MM` |
| 6 | F列 | 店舗名 | `record[].TENPO_NAME` | |
| 7 | G列 | スタジオ名 | `record[].STUDIO_NAME` | |
| 8 | H列 | ジャンル | `record[].GENRE_SUB_NAME` | |
| 9 | I列 | レベル | `record[].LEVEL_NAME` | |
| 10 | J列 | インストラクター名 | `record[].INSTRUCTOR_NAME` | |
| 11 | K列 | ニックネーム | `record[].NICKNAME` | |
| 12 | L列 | 女性限定 | `record[].WOMAN_FLG` | そのままの型 (真偽値/数値) |
| 13 | M列 | 男性限定 | `record[].MAN_FLG` | そのままの型 (真偽値) |
| 14 | N列 | URL | `record[].URL` | |
| 15 | O列 | インストラクター画像 | `record[].INSTRUCTOR_IMG` | |

## 5. エラーハンドリング仕様

| エラー種別 | 判定条件 / キャッチ箇所 | エラーメッセージ（UI表示） |
| --- | --- | --- |
| **シート未作成** | `getSheetByName('lessons')` が null の場合 | `「lessons」シートが見つかりません。事前にシートを作成してください。` |
| **JSONパースエラー** | `JSON.parse` 実行時の例外発生 | `不正な形式のJSONファイルです。内容をご確認ください。` |
| **データ構造異常** | 期待される階層が存在せず、有効データが0件 | `対象のデータが抽出できませんでした。JSON構造が異なる可能性があります。` |
| **サーバー側例外** | `processJsonUpload` 処理内のその他例外 (`try-catch`) | `サーバー処理エラー: [例外エラー本文]` |
| **通信・GAS環境エラー** | `withFailureHandler` がトリガーされた場合 | `通信エラーが発生しました。もう一度お試しください。` |

## 6. 前提条件・制約事項
*   **ヘッダー行について**: `lessons` シートの1行目は、ユーザーが手動で項目名を設定済みである前提とする。スクリプト実行時にヘッダーの自動生成・上書きは行わない。
*   **データのクリア方式**: アップロード処理の都度、既存のデータ範囲（2行目以降）を毎回クリア（値のみ消去）し、選択されたJSONの内容で**全件上書き**する（洗い替え処理）。データ追記型ではない。
*   **ファイルサイズ制約**: クライアントブラウザでのメモリ展開能力、およびGAS `google.script.run` のペイロード許容量（最大約50MB）の範囲内に収まるファイルサイズを前提とする。通常のAPIレスポンス長であれば支障はない。
