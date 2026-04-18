# JSONアップロード処理 基本設計書

## 1. 概要

カスタムメニューからアップロードされたJSONデータを解析し、スプレッドシート上の指定シート（lessons）へ表形式で展開・上書き保存する処理。

## 2. システム構成・アーキテクチャ

本処理は以下の2つのコンポーネントで構成される。

- **サーバーサイド (GAS - Code.gs)**: メニュー構築、データパース、スプレッドシートへの書き込み処理を担う。
- **クライアントサイド (HTML/JS - index.html)**: ファイル選択UIの提供、ファイルの読み込み、サーバーサイドへのデータ送信を担う。

## 3. 動作フロー詳細

1. **メニュー起動 [サーバー]**: スプレッドシートのカスタムメニュー「JSONデータをアップロード」をクリック。
2. **UI表示 [サーバー -> クライアント]**: HtmlService を利用し、モーダルダイアログ（index.html）を表示。
3. **ファイル選択 [クライアント]**: ユーザーがローカルのJSONファイルを選択（`<input type="file">`）。
4. **ファイル読み込み [クライアント]**:
   - FileReader API等を使用し、選択されたJSONファイルをフロントエンド側でテキスト（文字列）として読み込む。
5. **データ送信 [クライアント -> サーバー]**:
   - google.script.run を介して、読み込んだJSON文字列をサーバーサイドの処理関数へ送信する。
   - 処理中はUI上で「処理中...」などのステータスを表示する。
6. **データ解析・加工 [サーバー]**:
   - 受信したJSON文字列を JSON.parse() でオブジェクトに変換。
   - `body.Items[].time_list[].record[]` の階層を走査する。
   - 途中の配列が空または存在しない場合（例: time_list が空など）はエラーとせず、該当要素をスキップして走査を継続する。
   - 定義されたマッピングに従い、二次元配列データへ変換する。
   - 日付文字列（YYYYMMDD）を日付フォーマット（YYYY/MM/DD）へ変換する。
   - 指定のプロパティが存在しない場合は空文字（`""`）をセットする。
7. **書き込み処理 [サーバー]**:
   - lessons シートのオブジェクトを取得（存在確認を実施）。
   - 既存データ領域（2行目以降、データが存在する最終行・最終列まで）の値のみをクリア（`clearContent()`）。※セルの書式や罫線は維持する。
   - 変換後の二次元配列データを、`setValues()` で2行目・1列目から一括書き込みする。
8. **結果通知 [サーバー -> クライアント]**:
   - 成功件数またはエラーメッセージをクライアントへ返す。
   - クライアント側で結果を受け取り、ダイアログ上のUIへ表示する。

## 4. エラーハンドリング

- **シート非存在エラー**: lessons シートが存在しない場合、処理を中断し、UIにエラーメッセージを表示する。
- **データ構造・抽出エラー**: パースは成功したが、対象のデータ階層（body.Items 等）が存在せず有効なデータが1件も抽出できなかった場合、処理を中断し、エラーメッセージを表示する。
- **例外エラー**: パース時（不正なJSONフォーマット等）や通信時、書き込み時に予期せぬ例外が発生した場合、エラーメッセージとともにエラー詳細をUIに表示する。

## 5. 前提条件・制約事項

- **ヘッダー行**: lessons シートの1行目はユーザーが手動で設定済みである前提とする。スクリプトによるヘッダー名の上書きやフォーマット変更は行わない。
- **ファイルサイズ**: GASの google.script.run のペイロード制限（仕様上約50MB）に依存する。常識的なAPIレスポンスサイズ（数MB程度）を想定しており、巨大なJSONファイル（数十MB以上）のアップロードはタイムアウトやメモリ上限によるエラーの可能性がある。
- **ブラウザ環境**: クライアントサイドでのファイル読み込み処理（FileReader）をサポートするモダンブラウザでの利用を前提とする。

## 6. APIレスポンス構造

対象となるJSONデータは以下の構造を持つ（TypeScript型定義による表現）。

```typescript
type ApiResponse = {
  statusCode: number; // HTTPステータスコード (例: 200)
  body: {
    Items: DailyItem[]; // 曜日ごとのデータ配列
  };
};

type DailyItem = {
  YOUBI: string;       // 曜日文字列 (例: "MON")
  youbi_flg: string;   // 曜日フラグ (例: "1")
  time_list: TimeSlot[]; // その曜日の時間帯別データ配列
};

type TimeSlot = {
  time_class: string; // 時間帯の分類 (例: "11:00")
  time: string;       // 実際の時間 (例: "11:00")
  record: LessonRecord[]; // 該当時間帯のレッスンデータ配列
};

type LessonRecord = {
  SEQ: number;              // レッスンの固有ID
  TENPO_CD: string;         // 店舗コード
  HIDUKE: string;           // 日付 (YYYYMMDD形式)
  Y_TIME_START: string;     // レッスン開始時間 (HH:MM形式)
  Y_TIME_END: string;       // レッスン終了時間 (HH:MM形式)
  BRAND_ID: string;         // ブランドID
  NOAH_CATEGORY_ID: string; // カテゴリID
  GROUP_ID: string;         // グループID
  GENRE_CODE: string;       // ジャンルコード
  GENRE_SUB_NAME: string;   // ジャンル名
  GENRE2_SUB_NAME: string;  // サブジャンル名 (空文字の場合あり)
  TENPO_NAME: string;       // 店舗名
  STUDIO_CODE: string;      // スタジオコード
  STUDIO_NAME: string;      // スタジオ名
  LEVEL_CODE: string;       // レベルコード
  LEVEL_NAME: string;       // レベル名 (例: "超入門")
  INSTRUCTOR_CODE: string;  // インストラクターコード
  INSTRUCTOR_NAME: string;  // インストラクター名
  INSTRUCTOR_IMG: string;   // インストラクター画像URL
  NICKNAME: string;         // インストラクターのニックネーム
  TEAM: string | null;      // 所属チーム名
  URL: string;              // レッスン詳細URL
  WOMAN_FLG: boolean | number; // 女性専用フラグ (false または 0/1)
  MAN_FLG: boolean;         // 男性専用フラグ
  EVENT_FLG: number | null; // イベントフラグ
  EVENT_LESSON_NAME: string | null; // イベントレッスン名
  Y_DAIKOU_FLG: boolean;    // 代講フラグ
  RESERVE_FLG: boolean;     // 予約可能フラグ
  EXP_RESERVE_FLG: boolean; // 体験予約可能フラグ
  MOVE_CONSENT_FLG: boolean; // 移動同意フラグ
  SCHEDULE_HYOUJI_MEMO: string | null; // スケジュール表示用メモ
  LESSON_WEEKDAY: string;   // レッスン曜日コード
  LESSON_TIME_FROM: string; // レッスン開始時間 (HHMM形式)
  LESSON_TIME_TO: string;   // レッスン終了時間 (HHMM形式)
};
```

## 7. データマッピング定義

JSONデータの階層構造 `body.Items[].time_list[].record[]` を走査し、以下の通りマッピングして出力する。

| 列位置 | 出力項目名（想定） | 抽出元 JSONパス | 備考・加工処理 |
| --- | --- | --- | --- |
| A列 | レッスンID | record[].SEQ |  |
| B列 | 日付 | record[].HIDUKE | YYYYMMDD を YYYY/MM/DD に変換 |
| C列 | 曜日 | Items[].YOUBI | 親階層（Items）から取得 |
| D列 | 開始時間 | record[].Y_TIME_START |  |
| E列 | 終了時間 | record[].Y_TIME_END |  |
| F列 | 店舗名 | record[].TENPO_NAME |  |
| G列 | スタジオ名 | record[].STUDIO_NAME |  |
| H列 | ジャンル | record[].GENRE_SUB_NAME |  |
| I列 | レベル | record[].LEVEL_NAME |  |
| J列 | インストラクター名 | record[].INSTRUCTOR_NAME |  |
| K列 | ニックネーム | record[].NICKNAME |  |
| L列 | 女性限定 | record[].WOMAN_FLG |  |
| M列 | 男性限定 | record[].MAN_FLG |  |
| N列 | URL | record[].URL |  |
| O列 | インストラクター画像 | record[].INSTRUCTOR_IMG |  |
