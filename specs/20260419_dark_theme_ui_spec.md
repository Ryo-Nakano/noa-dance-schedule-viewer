# UI ダークテーマ対応

## 概要
- WebView (`src/view.html`) にダークテーマ対応を追加し、ユーザーがテーマを切り替えられるようにする。
- 屋内や夜間などの低照度環境での視認性向上と、モダンな外観を実現する。

## 仕様
### 機能要件
- テーマ切り替えボタン（ライト/ダーク）をヘッダーに配置する。
- ユーザーが選択したテーマを `localStorage` に保存し、次回アクセス時も維持する。
- デフォルトのテーマは、システム設定（`prefers-color-scheme`）に従うか、保存された設定を優先する。

### UI/メッセージ
- **テーマ切り替えボタン**: ヘッダー右側に配置（太陽/月アイコン）。
- **カラーパレット (Dark)**:
  - 背景: `bg-gray-900`
  - カード/モーダル背景: `bg-gray-800`
  - テキスト (主): `text-gray-100`
  - テキスト (副/キャプション): `text-gray-400`
  - ボーダー: `border-gray-700`
  - アクセント（青）: `text-blue-400`, `bg-blue-900/40`
  - アクセント（赤）: `text-red-400`, `bg-red-900/40`
  - アクセント（ピンク）: `text-pink-400`, `bg-pink-900/40`

### 制約・前提
- Tailwind CSS Play CDN を使用しているため、`tailwind.config` で `darkMode: 'class'` を設定し、`<html>` タグに `dark` クラスを付与することで制御する。
- Lucide アイコンは現在の React コンポーネント方式で動的に色を切り替える。

## 実装計画
### 使用するクラス・ファイル
- WebView: `src/view.html`

### 処理フロー
1. `src/view.html` の `<head>` 内の Tailwind 設定に `darkMode: 'class'` を追加する。
2. React States に `theme` ('light' | 'dark') を追加する。
3. `useEffect` でテーマの変更を監視し、`document.documentElement.classList` を更新するとともに `localStorage` に保存する。
4. 全ての UI 要素に `dark:` プレフィックスを用いたダークモーダ用クラスを追加する。
5. ヘッダーにテーマ切り替え用の `IconButton` を追加する。

### 技術的な判断・注意点
- **システム設定の優先**: 初回アクセス時に `localStorage` が空の場合は `window.matchMedia('(prefers-color-scheme: dark)')` を見て初期値を決定する。
- **コントラスト**: ダークモード時でもアクセシビリティを確保するため、十分なコントラスト比を持つ色を選択する。
