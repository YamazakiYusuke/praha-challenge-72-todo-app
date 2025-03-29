# Todo アプリケーション

このプロジェクトは [Create React App](https://github.com/facebook/create-react-app) を使用して作成された Todo アプリケーションです。

## 機能

- Todo タスクの追加、編集、削除
- タスクの完了状態の切り替え
- モダンなマテリアルUIデザイン
- モックサーバーを使用したAPIシミュレーション

## 利用可能なスクリプト

プロジェクトディレクトリで以下のコマンドを実行できます：

### `npm start`

開発モードでアプリを実行します。\
[http://localhost:3000](http://localhost:3000) を開いてブラウザで表示できます。

コードを変更すると、ページは自動的にリロードされます。\
コンソールに lint エラーも表示されます。

### `npm test`

インタラクティブなウォッチモードでテストランナーを起動します。\
詳細は[テストの実行](https://facebook.github.io/create-react-app/docs/running-tests)のセクションをご覧ください。

### `npm run build`

本番用のアプリを `build` フォルダにビルドします。\
Reactを本番モードで正しくバンドルし、最適なパフォーマンスのためにビルドを最適化します。

ビルドは圧縮され、ファイル名にはハッシュが含まれます。\
アプリケーションのデプロイ準備が整いました！

## 技術スタック

- React
- TypeScript
- Material-UI
- MSW (Mock Service Worker)

## プロジェクト構造

- `src/TodoList.tsx` - メインのTodoリストコンポーネント
- `src/TodoListLogic.ts` - ビジネスロジックの実装
- `src/repositories/` - データアクセス層
- `src/mocks/` - APIモックの実装

## 開発者向け情報

このプロジェクトでは、MSWを使用してAPIをモックしています。開発時は自動的にモックサーバーが起動します。

詳細なドキュメントは[React documentation](https://reactjs.org/)を参照してください。

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
