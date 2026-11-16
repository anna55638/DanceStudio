const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Получение всех учеников
router.get('/', (req, res) => {
    try {
        const students = db.prepare('SELECT * FROM students').all();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Добавление нового ученика
router.post('/', (req, res) => {
    try {
        const { first_name, last_name, birth_date, phone, email } = req.body;

        if (!first_name || !last_name) {
            return res.status(400).json({
                error: 'Имя и фамилия обязательны'
            });
        }

        const result = db.prepare(`
            INSERT INTO students (first_name, last_name, birth_date, phone, email)
            VALUES (?, ?, ?, ?, ?)
        `).run(first_name, last_name, birth_date, phone, email);

        res.status(201).json({
            message: 'Ученик успешно добавлен',
            id: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получение ученика по ID
router.get('/:id', (req, res) => {
    try {
        const student = db.prepare(
            'SELECT * FROM students WHERE id = ?'
        ).get(req.params.id);

        if (!student) {
            return res.status(404).json({
                error: 'Ученик не найден'
            });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Обновление данных ученика
router.put('/:id', (req, res) => {
    try {
        const { first_name, last_name, birth_date, phone, email } = req.body;

        const result = db.prepare(`
            UPDATE students
            SET first_name = ?, last_name = ?, birth_date = ?, phone = ?, email = ?
            WHERE id = ?
        `).run(first_name, last_name, birth_date, phone, email, req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({
                error: 'Ученик не найден'
            });
        }

        res.json({ message: 'Данные ученика успешно обновлены' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удаление ученика
router.delete('/:id', (req, res) => {
    try {
        const result = db.prepare(
            'DELETE FROM students WHERE id = ?'
        ).run(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({
                error: 'Ученик не найден'
            });
        }

        res.json({ message: 'Ученик успешно удалён' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;