// 必要なモジュールをインポート
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// データベースの接続とテーブル作成
const db = new sqlite3.Database('./orders.db');
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        table_number INTEGER,
        items TEXT,
        allergies TEXT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        genre TEXT,
        name TEXT,
        price INTEGER,
        image TEXT,
        allergies TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        password TEXT DEFAULT 'password'
    )`);
});

// ミドルウェアの設定
app.use(express.json());
app.use(express.static('public'));

// 画像アップロード設定
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MBまで
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
            return cb(new Error('画像形式はPNG, JPG, JPEGのみです'));
        }
        cb(null, true);
    }
});

// 注文データの保存エンドポイント
app.post('/submit-order', (req, res) => {
    const { table_number, items, allergies } = req.body;

    if (!table_number || !items) {
        return res.status(400).json({ message: '注文データが不完全です' });
    }

    const stmt = db.prepare("INSERT INTO orders (table_number, items, allergies) VALUES (?, ?, ?)");
    stmt.run(table_number, items, allergies || null);
    stmt.finalize();

    res.json({ message: '注文が正常に保存されました' });
});

// 注文データの取得（フィルタ機能付き）
app.get('/orders', (req, res) => {
    const { table, startDate, endDate } = req.query;
    let query = "SELECT * FROM orders WHERE 1=1";
    const params = [];

    if (table) {
        query += " AND table_number = ?";
        params.push(table);
    }
    if (startDate) {
        query += " AND date >= ?";
        params.push(startDate);
    }
    if (endDate) {
        query += " AND date <= ?";
        params.push(endDate);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'データの取得に失敗しました' });
        } else {
            res.json(rows);
        }
    });
});

// 注文データの削除
app.delete('/orders/:id', (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM orders WHERE id = ?", id, function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'データの削除に失敗しました' });
        } else {
            res.json({ deleted: this.changes });
        }
    });
});

// メニューの追加
app.post('/menu', upload.single('image'), (req, res) => {
    const { genre, name, price } = req.body;
    const allergies = req.body.allergies ? req.body.allergies.split(',') : [];

    if (!genre || !name || !price || !req.file) {
        return res.status(400).json({ message: 'メニュー情報が不完全です' });
    }

    const imagePath = `uploads/${req.file.filename}`;
    const stmt = db.prepare("INSERT INTO menu (genre, name, price, image, allergies) VALUES (?, ?, ?, ?, ?)");
    stmt.run(genre, name, price, imagePath, JSON.stringify(allergies), function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'メニューの保存に失敗しました' });
        }
        res.json({ id: this.lastID, message: 'メニューが正常に保存されました', imagePath });
    });
});

// メニューの取得
app.get('/menu', (req, res) => {
    db.all("SELECT * FROM menu", (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'メニューの取得に失敗しました' });
        } else {
            rows.forEach(row => {
                row.allergies = JSON.parse(row.allergies || '[]');
            });
            res.json(rows);
        }
    });
});

// パスワード変更
app.put('/password', (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ message: '新しいパスワードを入力してください' });
    }

    db.run("UPDATE admin SET password = ? WHERE id = 1", password, function (err) {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'パスワードの更新に失敗しました' });
        } else {
            res.json({ message: 'パスワードが更新されました' });
        }
    });
});

// サーバーを起動
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

