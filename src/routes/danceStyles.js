
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Получение всех направлений
router.get('/', (req, res) => {
    try {
        const styles = db.prepare('SELECT * FROM dance_styles').all();
        res.json(styles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получение направления по ID
router.get('/:id', (req, res) => {
    try {
        const style = db.prepare(
            'SELECT * FROM dance_styles WHERE id = ?'
        ).get(req.params.id);

        if (!style) {
            return res.status(404).json({ error: 'Направление не найдено' });
        }

        res.json(style);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Добавление направления
router.post('/', (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Название обязательно' });
        }

        const result = db.prepare(`
            INSERT INTO dance_styles (name, description)
            VALUES (?, ?)
        `).run(name, description);

        res.status(201).json({
            message: 'Направление успешно добавлено',
            id: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Обновление направления
router.put('/:id', (req, res) => {
    try {
        const { name, description } = req.body;

        const result = db.prepare(`
            UPDATE dance_styles
            SET name = ?, description = ?
            WHERE id = ?
        `).run(name, description, req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Направление не найдено' });
        }

        res.json({ message: 'Направление успешно обновлено' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удаление направления
router.delete('/:id', (req, res) => {
    try {
        const result = db.prepare(
            'DELETE FROM dance_styles WHERE id = ?'
        ).run(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Направление не найдено' });
        }

        res.json({ message: 'Направление успешно удалено' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
