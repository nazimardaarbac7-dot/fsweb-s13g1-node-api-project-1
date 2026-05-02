// SUNUCUYU BU DOSYAYA KURUN
const express = require("express");
const { insert, find, remove, update,findById } = require("./users/model");
const server = express();
server.use(express.json());

server.post("/api/users", async (req, res) => {
    const { name, bio } = req.body;
    if (!name || !bio)
        return res.status(400).json({
            message: "Lütfen kullanıcı için bir name ve bio sağlayın"
        });
    try {
        const newUser = await insert(req.body);
        return res.status(201).json(newUser);
    } catch (err) {
        return res.status(500).json({
            message: "Veritabanına kaydedilirken bir hata oluştu"
        });
    }
});

server.get("/api/users", async (req, res) => {
    try {
        const users = await find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            message: "Kullanıcı bilgileri alınamadı"
        });
    }
});

server.get("/api/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await findById(id);
        if (!user)
            return res.status(404).json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
        res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ message: "Kullanıcı bilgisi alınamadı" });
    }
});

server.delete("/api/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await remove(id);
        if (!user)
            return res.status(404).json({ message: "Belirtilen ID li kullanıcı bulunamadı" });
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ message: "Kullanıcı silinemedi" });
    }
});

server.put("/api/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const changes = req.body;
        if (!changes.name || !changes.bio)
            return res.status(400).json({ message: "Lütfen kullanıcı için name ve bio sağlayın" });

        const updated_user = await update(id, changes);
        if (!updated_user)
            return res.status(404).json({ message: "Belirtilen ID'li kullanıcı bulunamadı" });
        res.status(200).json(updated_user);
    } catch (err) {
        return res.status(500).json({ message: "Kullanıcı bilgileri güncellenemedi" });
    }
});



module.exports = server; // SERVERINIZI EXPORT EDİN {}
