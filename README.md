# ☁️ AWS アーキテクチャ & 料金計算ツール

AWS のシステム構成図をドラッグ＆ドロップで作成し、リアルタイムで月額コストを試算できる React アプリです。
AWS 公式スタイルの SVG アイコンを使用し、draw.io との連携・PDF 出力・JSON 保存/読み込みに対応しています。

---

## 📋 目次

- [機能一覧](#機能一覧)
- [起動方法](#起動方法)
- [操作方法](#操作方法)
- [対応サービス一覧](#対応サービス一覧)
- [料金計算について](#料金計算について)
- [保存・読み込み](#保存読み込み)
- [draw.io 連携](#drawio-連携)
- [PDF 出力](#pdf-出力)
- [よくある質問](#よくある質問)
- [技術スタック](#技術スタック)

---

## 機能一覧

| 機能 | 説明 |
|---|---|
| 🏗️ アーキテクチャ作成 | ドラッグ＆ドロップで 115 種類の AWS サービスを配置・接続 |
| 💰 リアルタイム料金計算 | 配置したサービスの月額コストを自動試算（リージョン別） |
| 📊 詳細料金設定 | サービスごとにインスタンスタイプ・台数・ストレージ等を細かく設定 |
| 🎨 AWS 公式アイコン | 55 種類の AWS 公式スタイル SVG アイコンをインライン描画 |
| 📄 PDF 出力 | アーキテクチャ図 + 料金レポートをプレビュー → HTML ダウンロード |
| 📐 draw.io 連携 | draw.io ファイルのエクスポート／インポート（複数シート対応） |
| 💾 JSON 保存/読み込み | アーキテクチャをファイルに保存・復元 |
| 🔖 ブラウザ保存 | localStorage に最大 10 件保存（ページ間を閉じても保持） |
| 🔍 サービス検索 | 名前・説明でサービスを絞り込み |
| 🌍 リージョン切替 | 東京・バージニア・シンガポール・フランクフルトの料金に対応 |
| 🔗 スマート接続 | ノード間を曲線矢印で接続（水平・垂直を自動判定） |
| 🔍 ズーム・パン | マウスホイールでズーム、ドラッグでキャンバスを移動 |

---

## 起動方法

### 方法 1：Claude.ai で開く（インストール不要・最速）

1. `aws-architect.jsx` を Claude.ai のチャットにアップロード
2. 「このファイルを Artifact で表示して」と送信
3. ブラウザ上でそのまま動作します

### 方法 2：Vite + React でローカル起動

**必要なもの：** Node.js 18 以上

```bash
# 1. Vite の React プロジェクトを作成
npm create vite@latest aws-architect -- --template react
cd aws-architect

# 2. 依存パッケージをインストール
npm install

# 3. aws-architect.jsx を App.jsx に上書き
cp /path/to/aws-architect.jsx src/App.jsx

# 4. 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:5173` を開くと動作します。

### 方法 3：StackBlitz（ブラウザ上・インストール不要）

1. [stackblitz.com](https://stackblitz.com/fork/react) で React プロジェクトをフォーク
2. `src/App.jsx` を `aws-architect.jsx` の内容で上書き
3. 自動でプレビューが更新されます

### 方法 4：CodeSandbox（ブラウザ上・インストール不要）

1. [codesandbox.io](https://codesandbox.io/s/react) で React テンプレートを開く
2. `App.js` を `aws-architect.jsx` の内容で置き換え
3. ファイル名を `App.jsx` にリネーム

---

## 操作方法

### 🏗️ アーキテクチャ作成タブ

#### サービスの配置

| 操作 | 方法 |
|---|---|
| サービスを追加 | 左パネルからキャンバスへドラッグ＆ドロップ |
| サービスを移動 | ノードをドラッグ |
| サービスを選択 | ノードをクリック（右パネルに設定が表示） |
| サービスを削除 | ノード選択 → 右上の **✕** ボタン、または `Delete` キー |
| サービスを検索 | 左パネル上部の検索ボックスに入力 |

#### サービスの接続

| 操作 | 方法 |
|---|---|
| 接続を開始 | ノード右側または下側の **＋** ボタンをクリック |
| 接続を完了 | 接続先ノードの **＋** ボタンをクリック |
| 接続をキャンセル | `Esc` キー |
| 接続を削除 | 接続線中央の **✕** バッジをクリック |

接続線はノードの配置方向（横・縦）に応じてポートと曲線が自動決定されます。

#### キャンバスの操作

| 操作 | 方法 |
|---|---|
| ズームイン・アウト | マウスホイール、または右上の **＋ / －** ボタン |
| パン（画面移動） | キャンバス背景をドラッグ |
| 表示をリセット | 右上の **⊙** ボタン |

---

### 💰 料金詳細タブ

左パネルにサービス一覧とカテゴリ別コストバーチャートが表示されます。サービスをクリックすると右パネルに詳細設定と料金内訳が開きます。

#### 設定できる主なパラメータ

| サービス | 設定項目 |
|---|---|
| **EC2** | インスタンスタイプ・台数・稼働時間/日・稼働日数/月 |
| **RDS** | インスタンスタイプ・台数・Multi-AZ・ストレージ・バックアップ容量・稼働時間 |
| **Lambda** | リクエスト数・平均実行時間・メモリサイズ（GB秒課金も自動計算） |
| **DynamoDB** | プロビジョンド / オンデマンド切替・WCU / RCU・ストレージ |
| **S3** | 標準ストレージ・低頻度アクセス・リクエスト数・転送量 |
| **Aurora** | プロビジョンド / サーバーレス切替・インスタンス数・ストレージ・I/O |
| **CloudWatch** | メトリクス数・ログ取込 / 保存容量・アラーム数・ダッシュボード数 |
| **Bedrock** | モデル選択（Claude / Llama 等）・入力 / 出力トークン数 |
| **NAT Gateway** | 台数・処理データ量 |
| **ALB / NLB** | 台数・LCU数 |

#### リージョン別料金係数

| リージョン | 係数 |
|---|---|
| 東京 (ap-northeast-1) | 基準 ×1.0 |
| バージニア (us-east-1) | ×0.85 |
| シンガポール (ap-southeast-1) | ×0.95 |
| フランクフルト (eu-central-1) | ×1.05 |

---

## 対応サービス一覧

**16 カテゴリ・115 種類**のサービスに対応しています。

| カテゴリ | 主なサービス |
|---|---|
| ☁️ コンピューティング | EC2, Lambda, ECS/Fargate, EKS, Lightsail, Elastic Beanstalk |
| 🗄️ ストレージ | S3, EBS, EFS, S3 Glacier, FSx, Storage Gateway |
| 🗃️ データベース | RDS, Aurora, DynamoDB, ElastiCache, DocumentDB, Neptune, Redshift, Keyspaces, Timestream |
| 🌐 ネットワーク | VPC, Subnet, Security Group, NACL, ALB, NLB, CloudFront, API Gateway, Route 53, NAT Gateway, Internet Gateway, VPC Endpoint, ENI, Transit Gateway, Direct Connect, VPN, Network Firewall, Client VPN, Route 53 Resolver, Global Accelerator |
| 📬 統合・メッセージング | SQS, SNS, EventBridge, Step Functions, AppSync, Kinesis, MSK |
| 🔐 セキュリティ・管理 | IAM, Cognito, WAF, CloudWatch, KMS, CloudTrail, Secrets Manager, Config, GuardDuty, Security Hub |
| 🤖 AI / 機械学習 | Bedrock, SageMaker, Rekognition, Polly, Transcribe, Translate, Comprehend, Textract |
| 📊 分析 | Athena, Redshift, Glue, EMR, OpenSearch, QuickSight |
| 🛠️ 開発ツール | CodeCommit, CodePipeline, CodeBuild, X-Ray, CloudFormation |
| 📡 IoT | IoT Core, IoT Analytics, Greengrass |
| ⚙️ 管理・ガバナンス | Organizations, Systems Manager, AWS Backup, Cost Explorer, AWS Budgets, Service Catalog, Well-Architected Tool |
| 🖥️ エンドユーザーコンピューティング | WorkSpaces, AppStream 2.0, WorkDocs, Amazon Connect |
| 🎬 メディア・配信 | MediaConvert, IVS, Elastic Transcoder, Chime SDK |
| 📱 モバイル・フロントエンド | Amplify, AppSync, Pinpoint, Device Farm |
| 🚚 移行・転送 | DMS, Snowball Edge, Transfer Family, MGN |
| ⛓️ その他 | Managed Blockchain, Ground Station, RoboMaker, Location Service |

---

## 料金計算について

> ⚠️ **本ツールの料金はあくまで概算です。** 実際の課金額は [AWS Pricing Calculator](https://calculator.aws/pricing/2/home) でご確認ください。

### 計算の基準

- **リージョン：** 東京 (ap-northeast-1) を基準とした概算単価
- **為替レート：** 1 USD = 155 JPY（固定）
- **無料利用枠：** Lambda（100万 req/月）・DynamoDB（25GB）等の常時無料枠を自動差引
- **データ転送：** 同一リージョン内は無料として計算

### コスト削減オプション（参考）

| オプション | 割引率 | 条件 |
|---|---|---|
| Savings Plans | 最大 66% | 1〜3年の使用量コミット |
| リザーブドインスタンス | 最大 72% | 1〜3年の特定インスタンスコミット |
| スポットインスタンス | 最大 90% | 中断可能なワークロード向け |

---

## 保存・読み込み

ヘッダーの **💾 保存 / 読み込み** ボタンからアクセスできます。

| 操作 | 説明 |
|---|---|
| **⬇️ JSON として保存** | ノード・接続・リージョン設定をファイルに保存 |
| **📂 JSON から読み込み** | 保存した JSON ファイルを選択して復元 |
| **🔖 ブラウザに保存** | localStorage に保存（最大 10 件・ページを閉じても保持） |
| **読込ボタン** | ブラウザ保存の一覧から選択して復元 |
| **✕ボタン** | ブラウザ保存データを削除 |

---

## draw.io 連携

**💾 保存 / 読み込み** メニューの「draw.io 連携」セクションから利用できます。

### エクスポート

1. **📐 draw.io でエクスポート** をクリック
2. `.drawio` ファイルがダウンロードされます
3. draw.io（Web 版・デスクトップ版）で開くと AWS 公式アイコン付きで表示されます

### インポート

1. **📥 draw.io から読み込み** をクリック
2. `.drawio` / `.xml` ファイルを選択
3. **シートが 1 枚** → そのままインポート
4. **シートが複数** → シート選択ダイアログが表示されます

draw.io 上の AWS 公式アイコン（`mxgraph.aws4.*`）を自動認識してサービスにマッピングします。

---

## PDF 出力

ヘッダーの **📄 PDF 出力** ボタンをクリックすると、プレビューモーダルが開きます。

### 出力の流れ

1. **📄 PDF 出力** ボタンをクリック → プレビューが表示される
2. 内容を確認したら **⬇️ HTML ダウンロード** をクリック
3. ダウンロードした HTML ファイルをブラウザで開く
4. `Ctrl+P`（Mac: `⌘P`）→ **「PDF として保存」** を選択

### PDF に含まれる内容

1. **ヘッダー** — レポートタイトル・リージョン・生成日時
2. **サマリーカード** — 月額（USD/JPY）・年額換算・サービス数
3. **アーキテクチャ図** — キャンバス上のノードと接続を再現
4. **サービス別コスト内訳テーブル** — コスト降順・シェア(%)付き
5. **カテゴリ別サマリー** — 横棒グラフ付き

> ※ Claude Artifacts 環境では `window.print()` がブロックされるため、HTML ダウンロード方式を採用しています。

---

## よくある質問

**Q. アイコンが絵文字で表示されるサービスがある**
A. AWS 公式スタイルの SVG アイコンは 55 種類定義されています。未定義のサービスは絵文字にフォールバックします。

**Q. FREE と表示される**
A. VPC・Subnet・Security Group・NACL・IAM などサービス自体が無料のリソース、または Lambda・DynamoDB などの無料枠内に収まっている場合に表示されます。

**Q. draw.io でインポートしたノードが正しく認識されない**
A. draw.io 上で AWS 公式の `mxgraph.aws4.*` シェイプを使用している場合に自動認識されます。カスタムシェイプはラベル名でマッチングを試みます。

**Q. PDF の日本語が文字化けする**
A. HTML ファイルを Chrome / Edge で開いて印刷することで正常に出力されます。

**Q. ブラウザ保存したデータが消えた**
A. localStorage はブラウザのデータ削除（シークレットモード終了・キャッシュクリア）で消えます。重要なデータは JSON ファイルでの保存を推奨します。

---

## 技術スタック

| 項目 | 内容 |
|---|---|
| フレームワーク | React 18（Hooks） |
| 言語 | JavaScript（JSX） |
| アイコン | AWS 公式スタイル SVG（インライン定義・55 種） |
| スタイリング | インライン CSS（外部ライブラリ不使用） |
| 保存形式 | JSON / localStorage / draw.io XML |
| PDF 生成 | HTML + ブラウザ印刷（jsPDF 不使用） |
| 外部依存 | React のみ（ゼロ外部依存） |
| ファイル構成 | 単一ファイル（aws-architect.jsx）|
| 総行数 | 約 2,950 行 |
| ファイルサイズ | 約 193 KB |

---

*料金情報の最終確認は必ず [AWS 公式料金ページ](https://aws.amazon.com/jp/pricing/) でお願いします。*
