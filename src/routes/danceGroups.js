
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Получение всех танцевальных групп
router.get('/', (req, res) => {
    try {
        const groups = db.prepare(`
            SELECT dance_groups.*,
                   dance_styles.name AS style_name,
                   teachers.first_name || ' ' || teachers.last_name AS teacher_name
            FROM dance_groups
            JOIN dance_styles ON dance_groups.style_id = dance_styles.id
            JOIN teachers ON dance_groups.teacher_id = teachers.id
        `).all();

        res.json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получение группы по ID
router.get('/:id', (req, res) => {
    try {
        const group = db.prepare(
            'SELECT * FROM dance_groups WHERE id = ?'
        ).get(req.params.id);

        if (!group) {
            return res.status(404).json({ error: 'Группа не найдена' });
        }

        res.json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Добавление группы
router.post('/', (req, res) => {
    try {
        const { name, style_id, teacher_id, age_group, max_students } = req.body;

        if (!name || !style_id || !teacher_id) {
            return res.status(400).json({
                error: 'Название, направление и преподаватель обязательны'
            });
        }

        const result = db.prepare(`
            INSERT INTO dance_groups
            (name, style_id, teacher_id, age_group, max_students)
            VALUES (?, ?, ?, ?, ?)
        `).run(name, style_id, teacher_id, age_group, max_students ?? 15);

        res.status(201).json({
            message: 'Танцевальная группа успешно добавлена',
            id: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Обновление группы
router.put('/:id', (req, res) => {
    try {
        const { name, style_id, teacher_id, age_group, max_students } = req.body;

        const result = db.prepare(`
            UPDATE dance_groups
            SET name = ?, style_id = ?, teacher_id = ?,
                age_group = ?, max_students = ?
            WHERE id = ?
        `).run(name, style_id, teacher_id, age_group, max_students, req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Группа не найдена' });
        }

        res.json({ message: 'Танцевальная группа успешно обновлена' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удаление группы
router.delete('/:id', (req, res) => {
    try {
        const result = db.prepare(
            'DELETE FROM dance_groups WHERE id = ?'
        ).run(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Группа не найдена' });
        }

        res.json({ message: 'Танцевальная группа успешно удалена' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
