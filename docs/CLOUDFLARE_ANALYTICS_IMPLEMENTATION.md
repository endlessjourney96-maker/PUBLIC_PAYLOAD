# Cloudflare匿名KPI実装計画

最終更新: 2026-09-11 11:00 JST

## 決定

公開MVPの全体KPI集計は **Workers Analytics Engine** を第一候補として実装する。

理由:
- Cloudflare公式でカスタムイベントの `writeDataPoint()` が提供されている。
- Workers Free は 100,000 data points/day・10,000 read queries/day の枠が案内されており、現MVP検証規模では追加固定費0円を狙える。
- 2026-09-11確認時点では Analytics Engine 利用への課金はまだ開始されていない旨が公式料金ページに記載されている。ただし将来課金予定のため継続監視する。
- 書き込みはnon-blockingで、計測障害を診断UXから分離しやすい。
- データ保持は3か月。MVP検証には十分だが、長期売上台帳には使わない。

## データセット

binding: `MVP_ANALYTICS`
dataset: `ai_workstyle_mvp_events`

1イベント=1 data point。

```text
blobs[0] event_name
blobs[1] source
blobs[2] campaign
blobs[3] pain
blobs[4] role
blobs[5] recommendation_id

doubles[0] 1
indexes[0] "mvp"
```

値は `docs/ANALYTICS_SPEC.md` の許可列挙値へ正規化する。IP、User-Agent、referrer全文、URL全文、氏名、メール、自由記述、端末IDは保存しない。

## ブラウザ→Worker契約

ブラウザから同一オリジン `POST /api/events` にJSONを送る。

許可イベント:
- `page_view`
- `diagnosis_start`
- `diagnosis_complete`
- `recommendation_click`

最大body 2KB。Content-Typeはapplication/jsonのみ。未知フィールドは破棄。イベント名・属性値はallowlistで正規化し、未知値は`other`。

レスポンスは204。Analytics書込失敗時も診断本体を壊さない。ブラウザ側は `navigator.sendBeacon` または `fetch(...,{keepalive:true})` を利用し、例外を握りつぶす。

## Wrangler設定案

```json
{
  "analytics_engine_datasets": [
    {
      "binding": "MVP_ANALYTICS",
      "dataset": "ai_workstyle_mvp_events"
    }
  ]
}
```

データセットはbinding定義後の初回writeで自動作成されるため、手動作成を前提にしない。

## 集計SQL

イベント別件数はAnalytics Engineのsamplingを考慮し `_sample_interval` を合計する。

```sql
SELECT
  blob1 AS event_name,
  SUM(_sample_interval) AS events
FROM ai_workstyle_mvp_events
WHERE timestamp >= NOW() - INTERVAL '24' HOUR
GROUP BY blob1
ORDER BY events DESC;
```

ファネル:
- start rate = diagnosis_start / page_view
- completion rate = diagnosis_complete / diagnosis_start
- recommendation CTR = recommendation_click / diagnosis_complete

母数0は算出しない。CV・売上は成果データ接続まで「未取得」。

## セキュリティ/QA

- POST以外は405。
- body >2KBは413。
- 不正JSONは400。
- Originは同一公開originのみ許可する。CORSを広く開けない。
- イベント値をSQL文字列へ直接連結しない。
- Analytics bindingが無い環境では204でfail-openし、consoleへ秘密情報を出さない。
- 同一操作の二重送信をブラウザ側で防ぐ。
- localStorage `mvp_events` は端末内QA専用として当面維持し、本番KPIとは混同しない。

## 実装順

1. Worker側 `/api/events` ハンドラとAnalytics Engine bindingを実装。
2. `index.html` の `event()` に匿名送信アダプタを追加し、localStorage QAログと併用。
3. 4イベントを手動QAし、診断が計測失敗時にも完走することを確認。
4. Analytics SQL APIで実測値を読む。API token作成が必要な段階はオーナー操作として停止する。

## コストガード

現段階では新規Paid契約を行わない。Free枠で検証する。CloudflareがAnalytics Engine課金開始を告知した場合は、月2,000円以下を再評価し、超える場合は停止/代替方式へ切り替える。

## 次アクション

次サイクルは調査を増やさず、Worker実装ファイルと設定ファイルを作成する。既存Cloudflare Git連携の構成を壊さないことを優先し、デプロイ方式が確定できない場合でもWorkerコードを永続化して次回へ引き継ぐ。
