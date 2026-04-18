以下の google スプレッドシートのノアダンスアカデミーのレッスン情報が格納されている。
NoaDanceScheduleViewer:
https://docs.google.com/spreadsheets/d/1P2KYL7W9HtfoI0PLiADMGpO2UrC_9TunrTewIfbdauI/edit?gid=0#gid=0

いまはレッスン一覧を手作業で取得して、取得した json データを手作業で upload する形式になっている。

やりたいこと:
api 経由でのレスン一覧データの取得 & スプレッドシートへの適用を自動化したい。

chrome の network タブで実際に web サイト上で行われている api リクエストを特定している。
以下の api リクエストが行われている。
```javascript
fetch("https://r8t00r3qx7.execute-api.ap-northeast-1.amazonaws.com/PRD", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-GB,en;q=0.9,ja-JP;q=0.8,ja;q=0.7,en-US;q=0.6",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Chromium\";v=\"146\", \"Not-A.Brand\";v=\"24\", \"Google Chrome\";v=\"146\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    "Referer": "https://www.noadance.com/"
  },
  "body": "{\"location\":[\"8\",\"4\",\"14\",\"15\",\"10\",\"13\",\"1\",\"7\",\"5\",\"3\",\"2\",\"6\",\"11\",\"12\"],\"genre\":[\"01\",\"18\",\"09\",\"03\",\"15\",\"10\",\"02\",\"08\",\"07\",\"06\",\"04\",\"05\"],\"brand\":\"1\",\"is_month\":true}",
  "method": "POST"
});
```

api レスポンスは以下ファイルを参照
tasks/20260418-noah-schedule-viewer/references/noa_all_lessons.json


curl で以下リクエストをして期待するレスポンスが得られることは検証済みのため、
データ取得の自動化は可能と考えている。
```shell
curl 'https://r8t00r3qx7.execute-api.ap-northeast-1.amazonaws.com/PRD' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: en-GB,en;q=0.9,ja-JP;q=0.8,ja;q=0.7,en-US;q=0.6' \
  -H 'content-type: application/json' \
  -H 'origin: https://www.noadance.com' \
  -H 'priority: u=1, i' \
  -H 'referer: https://www.noadance.com/' \
  -H 'sec-ch-ua: "Chromium";v="146", "Not-A.Brand";v="24", "Google Chrome";v="146"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: cross-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36' \
  --data-raw '{"location":["8","4","14","15","10","13","1","7","5","3","2","6","11","12"],"genre":["01","18","09","03","15","10","02","08","07","06","04","05"],"brand":"1","is_month":true}'
```
