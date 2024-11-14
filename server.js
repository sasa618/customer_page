// 必要なモジュールをインポート
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();

// Renderの環境で指定されるポートを取得し、デフォルトは3000
const port = process.env.PORT || 3000;

// データベースの接続とテーブル作成
const db = new sqlite3.Database('./orders.db');
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price INTEGER
    )`);
});

// ミドルウェアの設定
app.use(express.json()); // JSONデータの解析
app.use(express.static('public')); // 静的ファイルの提供

// 注文データの保存エンドポイント
app.post('/submit-order', (req, res) => {
    const order = req.body.order;

    if (!order || order.length === 0) {
        return res.status(400).json({ message: '注文データが空です' });
    }

    // トランザクションでデータを挿入
    const stmt = db.prepare("INSERT INTO orders (name, price) VALUES (?, ?)");
    order.forEach(item => {
        stmt.run(item.name, item.price);
    });
    stmt.finalize();

    res.json({ message: '注文が正常に保存されました' });
});

// 注文データの取得エンドポイント
app.get('/orders', (req, res) => {
    db.all("SELECT * FROM orders", (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'データの取得に失敗しました' });
        } else {
            res.json(rows); // すべての注文データを返す
        }
    });
});

// サーバーを起動
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
