
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Получение всех преподавателей
router.get('/', (req, res) => {
    try {
        const teachers = db.prepare('SELECT * FROM teachers').all();
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получение преподавателя по ID
router.get('/:id', (req, res) => {
    try {
        const teacher = db.prepare(
            'SELECT * FROM teachers WHERE id = ?'
        ).get(req.params.id);

        if (!teacher) {
            return res.status(404).json({ error: 'Преподаватель не найден' });
        }

        res.json(teacher);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Добавление преподавателя
router.post('/', (req, res) => {
    try {
        const { first_name, last_name, phone, email, specialization } = req.body;

        if (!first_name || !last_name) {
            return res.status(400).json({
                error: 'Имя и фамилия обязательны'
            });
        }

        const result = db.prepare(`
            INSERT INTO teachers (first_name, last_name, phone, email, specialization)
            VALUES (?, ?, ?, ?, ?)
        `).run(first_name, last_name, phone, email, specialization);

        res.status(201).json({
            message: 'Преподаватель успешно добавлен',
            id: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Обновление преподавателя
router.put('/:id', (req, res) => {
    try {
        const { first_name, last_name, phone, email, specialization } = req.body;

        const result = db.prepare(`
            UPDATE teachers
            SET first_name = ?, last_name = ?, phone = ?, email = ?, specialization = ?
            WHERE id = ?
        `).run(first_name, last_name, phone, email, specialization, req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Преподаватель не найден' });
        }

        res.json({ message: 'Данные преподавателя обновлены' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удаление преподавателя
router.delete('/:id', (req, res) => {
    try {
        const result = db.prepare(
            'DELETE FROM teachers WHERE id = ?'
        ).run(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Преподаватель не найден' });
        }

        res.json({ message: 'Преподаватель успешно удалён' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
