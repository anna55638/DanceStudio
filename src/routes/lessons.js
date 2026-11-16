
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Получение всех занятий
router.get('/', (req, res) => {
    try {
        const lessons = db.prepare(`
            SELECT lessons.*,
                   dance_groups.name AS group_name
            FROM lessons
            JOIN dance_groups ON lessons.group_id = dance_groups.id
            ORDER BY lessons.lesson_date, lessons.start_time
        `).all();

        res.json(lessons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получение занятия по ID
router.get('/:id', (req, res) => {
    try {
        const lesson = db.prepare(
            'SELECT * FROM lessons WHERE id = ?'
        ).get(req.params.id);

        if (!lesson) {
            return res.status(404).json({ error: 'Занятие не найдено' });
        }

        res.json(lesson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Добавление занятия
router.post('/', (req, res) => {
    try {
        const { group_id, lesson_date, start_time, duration, topic } = req.body;

        if (!group_id || !lesson_date || !start_time) {
            return res.status(400).json({
                error: 'Группа, дата и время обязательны'
            });
        }

        const result = db.prepare(`
            INSERT INTO lessons (group_id, lesson_date, start_time, duration, topic)
            VALUES (?, ?, ?, ?, ?)
        `).run(group_id, lesson_date, start_time, duration ?? 60, topic);

        res.status(201).json({
            message: 'Занятие успешно добавлено',
            id: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Обновление занятия
router.put('/:id', (req, res) => {
    try {
        const { group_id, lesson_date, start_time, duration, topic } = req.body;

        const result = db.prepare(`
            UPDATE lessons
            SET group_id = ?, lesson_date = ?, start_time = ?,
                duration = ?, topic = ?
            WHERE id = ?
        `).run(group_id, lesson_date, start_time, duration, topic, req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Занятие не найдено' });
        }

        res.json({ message: 'Занятие успешно обновлено' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удаление занятия
router.delete('/:id', (req, res) => {
    try {
        const result = db.prepare(
            'DELETE FROM lessons WHERE id = ?'
        ).run(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Занятие не найдено' });
        }

        res.json({ message: 'Занятие успешно удалено' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
