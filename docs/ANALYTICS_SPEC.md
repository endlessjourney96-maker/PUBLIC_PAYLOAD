# MVP匿名KPI計測仕様

最終更新: 2026-09-11 10:00 JST

## 目的

公開MVPのクリティカルパス `実ユーザー流入 → 診断完了 → 推薦クリック` を、個人情報を収集せず実測できるようにする。

## KPI

1. `page_view`: 診断トップの閲覧。
2. `diagnosis_start`: 最初の回答操作。
3. `diagnosis_complete`: 3問回答後に結果表示。
4. `recommendation_click`: 推薦候補の外部リンククリック。

補助属性は `source`, `campaign`, `pain`, `role`, `recommendation_id` のみに限定する。氏名、メール、自由記述、IPアドレスのアプリ保存、端末指紋、広告IDは扱わない。

## ファネル指標

- 診断開始率 = diagnosis_start / page_view
- 診断完了率 = diagnosis_complete / diagnosis_start
- 推薦CTR = recommendation_click / diagnosis_complete

母数が0の場合は算出しない。売上・CVは実際の成果データが接続されるまで0と推定せず「未取得」とする。

## 実装方針

現行 `localStorage(mvp_events)` は開発・端末内QA用途として残す。全体集計はCloudflare側で利用可能なプライバシー配慮型の計測機能を第一候補とし、追加固定費・規約・保存項目を確認してから導入する。外部Analytics SaaSの新規契約は現時点では行わない。

カスタムイベント送信を追加する場合も、イベント名と上記許可属性だけを送る。URLクエリ全体やreferrer全文をそのままイベント値へ保存しない。

## イベント契約

```text
page_view            {source?, campaign?, pain?, role?}
diagnosis_start      {source?, campaign?, pain?, role?}
diagnosis_complete   {source?, campaign?, pain?, role?}
recommendation_click {source?, campaign?, pain?, role?, recommendation_id}
```

値は既知の列挙値へ正規化し、未知値は `other` とする。

## QA受入条件

- 個人情報入力欄を追加しない。
- 診断そのものは計測失敗時も動作する（計測はfail-open）。
- 同じ操作で二重イベントを送らない。
- 開発用localStorage値を全体PV/CVとして報告しない。
- 推薦順位は報酬額で変えない。
- 本番計測導入前にCloudflare公式仕様・費用・データ取扱いを再確認する。

## 次アクション

1. Cloudflareの現行公式計測手段から、このイベント契約を追加固定費2,000円/月以下で満たせる方式を確認する。
2. 方式確定後、`index.html` に匿名イベント送信アダプタを追加する。
3. 公開後に実測値が取得できた時点からファネルKPI報告を開始する。
