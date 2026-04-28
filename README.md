# =Love 10人沼ガイド

=LOVE現メンバー10人の魅力を、公式プロフィール・公式SNS・公式公開動画へのリンクを中心に紹介する非公式ファンページです。

元ページ「Tinterpan」の熱量ある文章と、余白を活かしたカード型UIを受け継ぎつつ、検索・絞り込み・視聴メモ・モバイル表示を強化しています。

## ページ概要

- 初期表示は10人のメンバー一覧のみです。
- メンバー名をクリックすると、そのメンバーのArchiveページへ移動します。
- Profile表示中に別メンバーへ切り替えた場合は、Profileのまま切り替わります。
- Archiveでは、メンバーごとに60件の公式公開動画カードを表示します。
- 動画カードはYouTube公開サムネイルを参照し、動画そのものや公式画像は再配布しません。
- 視聴済みチェックはブラウザ内のメモとして保存されます。

## ファイル構成

```text
index.html        # React + Babel + Tailwind CDN の単一HTML
check_render.js   # Playwrightによるデスクトップ/モバイル表示確認
README.md         # この説明ファイル
```

## 主な機能

- 10人分のメンバー一覧
- メンバー別Archive / Profile
- タイトル・コメント検索
- 動画タイプ絞り込み
- タグ絞り込み
- 視聴済みのみ表示
- 旧Tinterpan視聴済みキーからの移行
- プライバシーポリシー同一HTML内表示
- 管理者・技術協力者のクレジット表示

## データ方針

メンバーの基本情報は、=LOVE公式プロフィールを主な参照元にしています。

- 血液型
- 星座
- 身長
- 生年月日
- 出身地
- 趣味
- 特技
- 資格
- 公式SNS / 公式プロフィールリンク

メンバーカラーは公式プロフィール掲載項目ではないため、公開プロフィール記事やファンの一般的な認識を参考にした「サイリウム/メンバーカラー」扱いです。更新時は必ず複数ソースを確認してください。

## 公開コンテンツの扱い

- 動画カードは公式YouTubeまたは公式に公開されている動画へのリンクを優先します。
- サムネイルは `https://i.ytimg.com/vi/...` の公開URLを参照します。
- メンバー公式画像はHTML内に保存しません。
- 個人YouTubeは、確認できたものだけプロフィールに掲載します。
- グループ公式SNSは個人プロフィールではなく、トップ画面に集約します。

## ローカル確認

このサイトは単一HTMLなので、通常は `index.html` をブラウザで開けば確認できます。

表示崩れや操作をまとめて確認する場合は、以下を実行します。

```powershell
$env:NODE_PATH='C:\Users\fuuta\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
& 'C:\Users\fuuta\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' check_render.js
```

期待される出力:

```text
desktop: ok
mobile: ok
```

## チェック項目

- トップに動画カードや検索窓が出ていないこと
- トップに10人全員が表示されること
- トップにグループ公式SNSが表示されること
- 各メンバーのArchiveが60件表示されること
- Profile表示中に別メンバーへ移動してもArchiveへ戻らないこと
- 検索、タイプ、タグ、視聴済み絞り込みが動くこと
- 舞香ページの動画ボタンが十分に読めること
- 横スクロールが発生しないこと
- プライバシーポリシーの内容が読者向けになっていること

## プライバシー

視聴済みチェックは、ブラウザのlocalStorageに保存される端末内メモです。会員登録、コメント投稿、問い合わせフォームはありません。

外部リンクを開いた場合は、YouTube、X、Instagram、TikTok、SHOWROOM、Ameba、公式アプリ、公式サイトなど各サービスのポリシーが適用されます。

## クレジット

- 総合管理者: あお / X: [@eyes_takamatsu](https://twitter.com/eyes_takamatsu)
- 技術協力: いろは紅葉 / X: [@iohana_momiji](https://twitter.com/iohana_momiji)

## 主な参照元

- [=LOVE公式サイト](https://equal-love.jp/)
- [=LOVE公式プロフィール一覧](https://equal-love.jp/feature/profile)
- [=LOVE公式YouTube](https://www.youtube.com/channel/UCv7VutirxDn3RWIJXI68n_A)
- [大谷映美里 YouTube「みりにゃと申します。」](https://www.youtube.com/channel/UCGxaJ2y2Le9jST3Me2aMPrw)
- [佐々木舞香・山本杏奈 YouTube「イコラブのあんまい」](https://www.youtube.com/channel/UCYIlZwRiBzkoixtuWqltIvw)

## 注意

このページは非公式ファンページです。=LOVE、所属事務所、各公式サービスとは直接関係ありません。掲載情報は公開情報をもとに作成していますが、公式発表が更新された場合は公式情報を優先してください。
