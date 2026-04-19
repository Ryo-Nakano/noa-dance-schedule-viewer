# Lessons DAO 作成仕様書

## 概要
- やりたいこと
  - `lessons` シートのデータを読み取り、行単位のオブジェクトを配列として取得できる DAO（Data Access Object）を作成する。
  - 後日作成予定の「レッスン一覧閲覧用の WebView」において、データ取得を行うために利用する。
- 背景・理由
  - シートのデータを扱いやすいオブジェクト形式で提供することで、WebView 等の他機能からのアクセスを容易にするため。

## 仕様

### 機能要件
- **責務**: `lessons` シートの全件取得機能のみを提供する（読み取り専用）。書き込み（Update, Insert, Delete）は実装しない。
- **メソッド**: `all` （静的ゲッター）を実装し、全行のデータをオブジェクト配列として返す。
- **データ範囲**:
  - 1行目はヘッダーとしてスキップし、2行目以降をデータとして扱う。
- **バリデーション（除外ルール）**:
  - `lessonId` （ID列）が Falsy （空文字、`null`、`undefined` 等）の行はデータとして無効と判定し、戻り値の配列から除外する。
- **アーキテクチャ準拠**:
  - `ARCHITECTURE.md` に基づき、各行のオブジェクトは `Object.freeze()` で不変化（イミュータブル）にして返す。
  - プロパティの取得には、ハードコーディングした列インデックス（例: `row[0]`）を使用せず、必ず名前付き範囲 (`constants.js` に定義) を経由して取得する。
- **型の取り扱い**:
  - `getValues()` で取得したスプレッドシートの生のデータ型（String, Number, Boolean, Date オブジェクト等）をそのまま保持する。DAO側で独自のフォーマット変換や文字列キャストは行わない。

### データのマッピング（プロパティ名定義と名前付き範囲）
取得したオブジェクトは以下のプロパティを持つこととします。列の取得には以下の名前付き範囲定数を用います。

| 出力項目名 | オブジェクトプロパティ | 定数 (`NAMED_RANGES.BOUND_SHEETS.LESSONS.*`) | 備考 |
| -- | -- | -- | -- |
| レッスンID | `lessonId` | `ID` | 数値想定（`filter`でFalsyを除外） |
| 日付 | `date` | `DATE` | `YYYY/MM/DD` カラム（Date型やString等のまま） |
| 曜日 | `dayOfWeek` | `DAY_OF_WEEK` | |
| 開始時間 | `startTime` | `START_TIME` | `HH:MM` 形式 |
| 終了時間 | `endTime` | `END_TIME` | `HH:MM` 形式 |
| 店舗名 | `storeName` | `STORE_NAME` | |
| スタジオ名 | `studioName` | `STUDIO_NAME` | |
| ジャンル | `genre` | `GENRE` | |
| レベル | `level` | `LEVEL` | |
| インストラクター名 | `instructorName` | `INSTRUCTOR_NAME` | |
| ニックネーム | `nickname` | `NICKNAME` | |
| 女性限定 | `isWomanOnly` | `IS_WOMAN_ONLY` | 真偽値などのまま |
| 男性限定 | `isManOnly` | `IS_MAN_ONLY` | |
| URL | `url` | `URL` | |
| インストラクター画像 | `instructorImageUrl` | `INSTRUCTOR_IMAGE_URL` | |

### UI/メッセージ
- メニュー名・確認・完了・エラーメッセージ等は一切なし（純粋なデータアクセス層のため）。

### 制約・前提・詳細パス
- **継承元**: `src/base_classes/base_sheet_data.js` で定義されている `BoundSheetData`
- **作成ファイル**: `src/sheet_data/bound_sheet/lessons.js`
- **クラス名**: `Lessons`

---

## 実装手順（引き継ぎ用詳細）

担当者は以下の手順に沿って実装を行ってください。解釈の余地がないようアプローチを固定化しています。

### 1. `src/constants.js` の改修
既存の `constants.js` に対し、シート名と名前付き範囲の定数定義を追加する。
```javascript
export const BOUND_SHEETS = {
  LESSONS: 'lessons',
};

export const NAMED_RANGES = {
  BOUND_SHEETS: {
    LESSONS: {
      ID: 'LESSONS.ID',
      DATE: 'LESSONS.DATE',
      DAY_OF_WEEK: 'LESSONS.DAY_OF_WEEK',
      START_TIME: 'LESSONS.START_TIME',
      END_TIME: 'LESSONS.END_TIME',
      STORE_NAME: 'LESSONS.STORE_NAME',
      STUDIO_NAME: 'LESSONS.STUDIO_NAME',
      GENRE: 'LESSONS.GENRE',
      LEVEL: 'LESSONS.LEVEL',
      INSTRUCTOR_NAME: 'LESSONS.INSTRUCTOR_NAME',
      NICKNAME: 'LESSONS.NICKNAME',
      IS_WOMAN_ONLY: 'LESSONS.IS_WOMAN_ONLY',
      IS_MAN_ONLY: 'LESSONS.IS_MAN_ONLY',
      URL: 'LESSONS.URL',
      INSTRUCTOR_IMAGE_URL: 'LESSONS.INSTRUCTOR_IMAGE_URL',
    }
  }
};
```

### 2. DAO クラスの新規作成
`src/sheet_data/bound_sheet/lessons_data.js` を作成し、以下を満たすロジックを実装する。

**必須の Import 文**:
```javascript
import { BoundSheetData } from "base_classes/base_sheet_data";
import { BOUND_SHEETS, NAMED_RANGES } from "constants";
```

**`LessonsData.all` ゲッター内のロジック要件**:
1. キャッシュの評価 (`this._allCache` があればそれを返す)。未キャッシュ時に内部関数等を用いて実処理を行う。
2. `const sheet = this._getSheet(BOUND_SHEETS.LESSONS);` でシートを取得。
3. `this._getNamedRangeColsOf(sheet)` で列のインデックス情報 (`cols`) を取得。
4. `sheet.getDataRange().getValues().slice(1)` でヘッダーを除く全行データを取得。
5. ID列が Falsy のものをフィルタリングする。
   - インデックス取得は `cols[NAMED_RANGES.BOUND_SHEETS.LESSONS.ID] - 1` とする。
   - `filter(row => !!row[idColIndex])` 等で除外。
6. `map` を使用して残りの行オブジェクトを構築し、必ず `Object.freeze({...})` で包んでリターンする。各プロパティに対しても同様に `cols[...] - 1` でスプレッドシートの値を引き当てる。

以上の設計に則っていれば、別の開発者が実装しても齟齬は生じません。
