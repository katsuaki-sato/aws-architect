# ☁️ AWS アーキテクチャ & 料金計算ツール

AWS のシステム構成図をドラッグ＆ドロップで作成し、リアルタイムで月額コストを試算できる React アプリです。

---

## 📋 目次

- [機能一覧](#機能一覧)
- [起動方法](#起動方法)
- [操作方法](#操作方法)
- [対応サービス一覧](#対応サービス一覧)
- [料金計算について](#料金計算について)
- [PDF出力](#pdf出力)
- [よくある質問](#よくある質問)

---

## 機能一覧

| 機能 | 説明 |
|---|---|
| 🏗️ アーキテクチャ作成 | ドラッグ＆ドロップで AWS サービスを配置・接続 |
| 💰 リアルタイム料金計算 | 配置したサービスの月額コストを自動試算 |
| 📊 料金詳細パネル | サービスごとの細かいパラメータ設定と内訳表示 |
| 📄 PDF 出力 | アーキテクチャ図 + 料金レポートを A4 PDF でダウンロード |
| 🗺️ ミニマップ | 大規模構成でも全体像を把握できるミニマップ表示 |
| 🔍 サービス検索 | 104 種類のサービスを名前で絞り込み |
| 🌍 リージョン切替 | 東京・バージニア・シンガポール・フランクフルトの料金に対応 |
| 🔗 スマート接続 | ノード間を曲線矢印で接続（水平・垂直を自動判定） |

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
2. 左ファイルパネルの `src/App.jsx` を開く
3. `aws-architect.jsx` の内容を全選択してペースト
4. 自動でプレビューが更新されます

### 方法 4：CodeSandbox（ブラウザ上・インストール不要）

1. [codesandbox.io](https://codesandbox.io/s/react) で React テンプレートを開く
2. `App.js` の内容を `aws-architect.jsx` の内容で置き換え
3. ファイル名を `App.jsx` にリネーム
4. 右パネルのプレビューに表示されます

---

## 操作方法

### 🏗️ アーキテクチャ作成タブ

#### サービスの配置

| 操作 | 方法 |
|---|---|
| サービスを追加 | 左パネルからキャンバスへドラッグ＆ドロップ |
| サービスを移動 | ノードをドラッグ |
| サービスを選択 | ノードをクリック（右パネルに設定が表示） |
| サービスを削除 | ノードを選択 → 右上の **✕** ボタン、または `Delete` キー |
| サービスを検索 | 左パネル上部の検索ボックスに入力 |

#### サービスの接続

| 操作 | 方法 |
|---|---|
| 接続を開始 | ノード右側または下側の **＋** ボタンをクリック |
| 接続を完了 | 接続先ノードの **＋** ボタンをクリック |
| 接続をキャンセル | `Esc` キー |
| 接続を削除 | 接続線中央の **✕** バッジをクリック |

接続線は自動的に曲線でルーティングされます。ノードの配置方向（横・縦）に応じて出口ポートが自動選択されます。

#### キャンバスの操作

| 操作 | 方法 |
|---|---|
| ズームイン・アウト | マウスホイール、または右下の **＋ / －** ボタン |
| パン（画面移動） | キャンバス背景をドラッグ |
| 表示をリセット | 右下の **⊙** ボタン |
| ミニマップ確認 | 2つ以上ノードがある場合、左下に自動表示 |

#### 設定パネル（右パネル）

ノードを選択すると右パネルが開き、インスタンスタイプや台数などを設定できます。設定値はリアルタイムで料金に反映されます。

---

### 💰 料金詳細タブ

左パネルにサービス一覧とカテゴリ別コストバーチャートが表示されます。サービスをクリックすると右パネルに詳細が開きます。

#### 設定できる主なパラメータ

| サービス | 設定項目 |
|---|---|
| **EC2** | インスタンスタイプ・台数・稼働時間/日・稼働日数/月 |
| **RDS** | インスタンスタイプ・台数・Multi-AZ・ストレージ・バックアップ容量 |
| **Lambda** | リクエスト数・平均実行時間・メモリサイズ |
| **DynamoDB** | プロビジョンド / オンデマンド切替・WCU / RCU・ストレージ |
| **S3** | 標準ストレージ・低頻度アクセス・リクエスト数・転送量 |
| **CloudWatch** | メトリクス数・ログ取込 / 保存容量・アラーム数 |
| **Bedrock** | モデル選択・入力 / 出力トークン数 |
| **NAT Gateway** | 台数・処理データ量 |
| **ALB** | 台数・LCU数 |

料金内訳パネルには項目ごとのコストとバーグラフが表示されます。また、**計算式**セクションで各サービスの課金ロジックを確認できます。

#### リージョン切替

ヘッダー右上のドロップダウンからリージョンを変更できます。

| リージョン | 係数 |
|---|---|
| 東京 (ap-northeast-1) | 基準 (×1.0) |
| バージニア (us-east-1) | ×0.85 |
| シンガポール (ap-southeast-1) | ×0.95 |
| フランクフルト (eu-central-1) | ×1.05 |

---

## 対応サービス一覧

計 **116 種類**のサービスに対応しています。

| カテゴリ | 主なサービス |
|---|---|
| ☁️ コンピューティング | EC2, Lambda, ECS/Fargate, EKS, Lightsail, Elastic Beanstalk |
| 🗄️ ストレージ | S3, EBS, EFS, S3 Glacier, FSx, Storage Gateway |
| 🗃️ データベース | RDS, Aurora, DynamoDB, ElastiCache, DocumentDB, Neptune, Keyspaces, Timestream |
| 🌐 ネットワーク | VPC, Subnet, Security Group, NACL, ALB, NLB, CloudFront, API Gateway, Route 53, NAT Gateway, Internet Gateway, VPC Endpoint, ENI, Transit Gateway, Direct Connect, VPN, Network Firewall, Client VPN, Route 53 Resolver |
| 📬 統合・メッセージング | SQS, SNS, EventBridge, Step Functions, AppSync, Kinesis, MSK |
| 🔐 セキュリティ・管理 | IAM, Cognito, WAF, CloudWatch, KMS, CloudTrail, Secrets Manager, Config, GuardDuty, Security Hub |
| 🤖 AI / 機械学習 | Bedrock, SageMaker, Rekognition, Polly, Transcribe, Translate, Comprehend, Textract |
| 📊 分析 | Athena, Redshift, Glue, EMR, OpenSearch, QuickSight |
| 📡 IoT | IoT Core, IoT Analytics, Greengrass |
| ⚙️ 管理・ガバナンス | Organizations, CloudFormation, Systems Manager, AWS Backup, Cost Explorer, AWS Budgets |
| 🖥️ エンドユーザーコンピューティング | WorkSpaces, AppStream 2.0, WorkDocs, Amazon Connect |
| 🎬 メディア・配信 | MediaConvert, IVS, Elastic Transcoder, Chime SDK |
| 📱 モバイル・フロントエンド | Amplify, AppSync, Pinpoint, Device Farm |
| 🚚 移行・転送 | DMS, Snowball Edge, Transfer Family, MGN |
| ⛓️ その他 | Managed Blockchain, Ground Station, RoboMaker, Location Service |

---

## 料金計算について

> ⚠️ **本ツールの料金はあくまで概算です。** 実際の課金額は AWS コンソールまたは [AWS Pricing Calculator](https://calculator.aws/pricing/2/home) でご確認ください。

### 計算の基準

- **リージョン：** 東京 (ap-northeast-1) を基準とした概算単価
- **為替レート：** 1 USD = 155 JPY（固定）
- **無料利用枠：** 常時無料枠（Lambda・DynamoDB 等）は自動的に差し引いて計算
- **データ転送：** 同一リージョン内転送は無料として扱います

### コスト削減オプション（参考）

| オプション | 割引率 | 条件 |
|---|---|---|
| Savings Plans | 最大 66% | 1〜3年の使用量コミット |
| リザーブドインスタンス | 最大 72% | 1〜3年の特定インスタンスコミット |
| スポットインスタンス | 最大 90% | 中断可能なワークロード向け |

---

## PDF 出力

ヘッダー右上の **「📄 PDF 出力」** ボタンをクリックすると、A4 縦向きの PDF がダウンロードされます。

PDF に含まれる内容：

1. **ヘッダー** — レポートタイトル・リージョン・生成日時
2. **サマリーカード** — 月額（USD/JPY）・年額換算・サービス数
3. **アーキテクチャ図** — キャンバス上のノードと接続を再現
4. **サービス別コスト内訳テーブ** — コスト降順でソート、シェア(%)付き
5. **カテゴリ別サマリー** — 横棒グラフ付き
6. **フッター** — 免責事項・ページ番号

> ※ PDF 生成には [jsPDF](https://github.com/parallax/jsPDF) を動的ロードします。初回は数秒かかる場合があります。

---

## よくある質問

**Q. アイコンが絵文字になっているサービスがある**  
A. AWS 公式スタイルの SVG アイコンが定義されていないサービスは絵文字にフォールバックします。主要サービス 55 種類はカスタム SVG アイコンで表示されます。

**Q. 料金が 0 円 / FREE と表示される**  
A. VPC・Subnet・Security Group・NACL・IAM など、サービス自体は無料のリソースです。また Lambda・DynamoDB などは無料枠内に収まっている場合に FREE と表示されます。

**Q. 接続線が意図しない方向に出る**  
A. ノードの相対位置（横方向・縦方向どちらが大きいか）で出口ポートが自動決定されます。ノードを動かして位置関係を調整してください。

**Q. ズームしたら文字が見づらい**  
A. ズームコントロール（右下）の **⊙** ボタンでリセットできます。

**Q. PDF の日本語が文字化けする**  
A. jsPDF はデフォルトで日本語フォントを含んでいないため、日本語テキストが一部文字化けする場合があります。サービス名・数値・英語部分は正常に出力されます。

---

## 技術スタック

| 項目 | 内容 |
|---|---|
| フレームワーク | React 18 (Hooks) |
| 言語 | JavaScript (JSX) |
| PDF 生成 | jsPDF 2.5.1（動的ロード） |
| アイコン | AWS 公式スタイル SVG（インライン定義） |
| スタイリング | インライン CSS（外部ライブラリ不使用） |
| 依存パッケージ | React のみ（ゼロ外部依存） |

---

*料金情報の最終確認は必ず [AWS 公式料金ページ](https://aws.amazon.com/jp/pricing/) でお願いします。*
