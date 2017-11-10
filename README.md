# コーディングチャレンジ

## リンク

- https://github.com/uber/coding-challenge-tools
- https://github.com/uber/coding-challenge-tools/blob/master/coding_challenge.md

## 選択アプリ: SF Movies

サンフランシスコの映画ロケ地を地図上に示すサービス。
補完機能のあるフィルタを使って結果を絞り込むことができる。

## 機能

- ページが読み込まれたら、登録のあるすべてのロケ地を地図上に表示する。
- 映画のタイトルの一部をテキストフィールドに入力して Enter で絞り込みが行える。
- タイトルのテキストフィールドは一部を入力すると一致する候補一覧を表示してくれる。
- 候補一覧は上下カーソルキーで選択でき、 Enter キーでそれを入力できる。
- 候補一覧はクリックでも選択できる。

## 技術

- バックエンド
    - Python
    - [Flask](http://flask.pocoo.org/docs/)
- フロントエンド
    - JavaScript
        - [Vue.js](https://vuejs.org/)
        - [axios](https://github.com/axios/axios)
        - [Lodash](https://lodash.com/)
    - CSS
        - なし
- DB
    - SQLite （リポジトリに登録）

## 残課題 / 改善が可能なポイント

- 全体
    - 自動テストの追加
- バックエンド
    - ビューの整理
    - ファイルの粒度の調整
- フロントエンド
    - コンポーネントの粒度の調整
    - 依存ライブラリを CDN から自サイト提供に変更
    - 「 ES xx 」の導入
    - 見栄え（ css ）の調整
    - SCSS の導入
    - バックエンドから取得した映画候補のキャッシュ導入
- DB
    - 正規化（映画情報とロケ地情報の分割）
    - 非 SQLite 化
