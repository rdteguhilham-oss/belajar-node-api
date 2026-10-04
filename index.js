const express = require ('express');
const mysql = require ('mysql2');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

app.use (express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "kelurahan"
});

// GET - TANPA RELASI (SEMUA DATA)

app.get('/pengajuan', (req, res) => {
    const sql = `
        SELECT *
        FROM pengajuan
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Gagal Menampilkan Data!"
            });
        }

        res.json(results);
    });
});

// GET - BERDASARKAN ID 

app.get('/pengajuan/:id', (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT *
        FROM pengajuan
        WHERE id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Gagal Menampilkan Data!"
            });
        }

        res.json(results);
    });
});

// GET - BERDASARKAN QUERY/FILTER

app.get('/pengajuan', (req, res) => {
    const { status } = req.query;

    const sql = `
        SELECT *
        FROM pengajuan
        WHERE status = ?
    `;

    db.query(sql, [status], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Gagal Menampilkan Data!"
            });
        }

        res.json(results);
    });
});

// GET - BERDASARKAN NAMA

app.get('/pengajuan', (req, res) => {
    const { nama } = req.query;

    const sql = `
        SELECT *
        FROM pengajuan
        WHERE nama = ?
    `;

    db.query(sql, [nama], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Gagal Menampilkan Data!"
            });
        }

        res.json(results);
    });
});

// GET - SEMUA RELASI PELANGGAN DAN PESANAN

app.get('/pesanan', (req, res) => {
    const sql = `
        SELECT pelanggan.nama, pesanan.produk, pesanan.status
        FROM pelanggan
        JOIN pesanan
        ON pelanggan.id = pesanan.pelanggan_id
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Gagal Menampilkan Data!"
            });
        }

        res.json(results);
    });
});

// GET - RELASI BERDASARKAN ID

app.get('/pesanan/:id', (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT pelanggan.nama, pesanan.produk, pesanan.status
        FROM pelanggan
        JOIN pesanan
        ON pelanggan.id = pesanan.pelanggan_id
        WHERE pesanan.id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Gagal Menampilkan Data!"
            });
        }

        res.json(results);
    });
});

// GET - RELASI BERDASARKAN NAMA

app.get('/pesanan', (req, res) => {
    const { nama } = req.query;

    const sql = `
        SELECT pelanggan.nama, pesanan.produk, pesanan.status
        FROM pelanggan
        JOIN pesanan
        ON pelanggan.id = pesanan.pelanggan_id
        WHERE pelanggan.nama = ?
    `;

    db.query(sql, [nama], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Gagal Menampilkan Data!"
            });
        }

        res.json(results);
    });
});

// GET - RELASI BERDASARKAN STATUS

app.get('/pesanan', (req, res) => {
    const { status } = req.query;

    const sql = `
        SELECT pelanggan.nama, pesanan.produk, pesanan.status
        FROM pelanggan
        JOIN pesanan
        ON pelanggan.id = pesanan.pelanggan_id
        WHERE pesanan.status = ?
    `;

    db.query(sql, [status], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Gagal Menampilkan Data!"
            });
        }

        res.json(results);
    });
});

// POST - TANPA RELASI

app.post('/pengajuan', (req, res) => {
    const { nama, keperluan } = req.body;

    const sql = `
        INSERT INTO pengajuan (nama, keperluan)
        VALUES (?, ?)
    `;

    db.query(sql, [nama, keperluan], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Gagal Menyimpan Data!"
            });
        }

        res.json({
            message: "Data Berhasil Disimpan!",
            id: result.insertId
        });
    });
});

// POST - DENGAN RELASI

app.post('/pelanggan', (req, res) => {
    const { nama, produk } = req.body;

    const sqlPelanggan = `
        INSERT INTO pelanggan (nama)
        VALUES (?)
    `;

    db.query(sqlPelanggan, [nama], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Gagal Menyimpan Pelanggan!"
            });
        }

        const pelangganId = result.insertId;

        produk.forEach((item) => {
            const sqlPesanan = `
                INSERT INTO pesanan (pelanggan_id, produk)
                VALUES (?, ?)
            `;

            db.query(sqlPesanan, [pelangganId, item], (err) => {
                if (err) {
                    console.error(err);
                }
            });
        });

        res.json({
            message: "Pelanggan dan Pesanan Berhasil Disimpan!",
            pelangganId: pelangganId
        });
    });
});

// PUT - TANPA RELASI

app.put('/pengajuan/:id', (req, res) => {
    const { id } = req.params;
    const { nama, keperluan } = req.body;

    const sql = `
        UPDATE pengajuan
        SET nama = ?, keperluan = ?
        WHERE id = ?
    `;

    db.query(sql, [nama, keperluan, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Gagal Memperbarui Data!"
            });
        }

        res.json({
            message: "Data Berhasil Diperbarui!"
        });
    });
});

// PUT - DENGAN RELASI

app.put('/pesanan/:id', (req, res) => {
    const {id} = req.params;
    const {status} = req.body;

    const sql = `
        UPDATE pesanan
        SET status = ?
        WHERE id = ?
    `;
    
   db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Gagal Memperbarui Data!"
            });
        }
        res.json({
            message: "Data Berhasil Diperbarui!"
        }); 
   }); 
});

// DELETE - TANPA RELASI

app.delete('/pengajuan/:id', (req, res) => {
    const {id} = req.params

    const sql = "DELETE FROM pengajuan WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Gagal Mengahapus Data!"
            });
        }
        res.json({
            message: "Data Berhasil Dihapus!"
        });
    });
});


// DELETE - DENGAN RELASI

app.delete('pesanan/:id', (err, res) => {
    const {id} = req.params;
    const sql = `
        DELETE FROM pesanan
        WHERE id = ?
    `;
    db.query(sql, [id], (err,result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Gagal Menghapus Data!"
            });
        }
        res.json({
            message: "Data Berhasil Dihapus!"
        });
    });
});

app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `
        INSERT INTO users (username, password)
        VALUES (?, ?)
    `;
    db.query(sql, [username, hashedPassword], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Gagal Menyimpan Username Dan Password!"
            });
        }
        res.json({
            message : "Berhasil Menyimpan Username Dan Password"
        });
    });
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const sql = `
        SELECT *
        FROM users
        WHERE username = ?
    `;
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Terjadi kesalahan pada server!"
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "Username atau Password salah!"
            });
        }

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Username Atau Password salah!"
            });
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "1h"});

        res.json({
            message: "Login Berhasil!",
            token: token
        });
    });
});

db.connect((err) => {
    if (err) {
        console.error("Koneksi database gagal:", err);
        return;
    }

    console.log("Berhasil terhubung ke MySQL");
});

app.listen(3000,() => {
    console.log('server berjalan di port 3000!');
});