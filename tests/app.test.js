
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../src/app');

describe('DanceStudio API — CRUD-тестирование', () => {
    let teacherId;
    let styleId;
    let groupId;
    let lessonId;

    // 1. Проверка API
    test('GET / возвращает сообщение о работе API', async () => {
        const response = await request(app).get('/');

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('DanceStudio API работает!');
    });

    // 2. Полный CRUD учеников
    test('CRUD учеников', async () => {
        const created = await request(app)
            .post('/api/students')
            .send({
                first_name: 'Иван',
                last_name: 'Иванов',
                birth_date: '2005-04-12',
                phone: '89990000001',
                email: 'ivan@test.ru'
            });

        expect(created.statusCode).toBe(201);
        const id = created.body.id;

        const list = await request(app).get('/api/students');
        expect(list.statusCode).toBe(200);
        expect(list.body.some(student => student.id === id)).toBe(true);

        const found = await request(app).get(`/api/students/${id}`);
        expect(found.statusCode).toBe(200);
        expect(found.body.first_name).toBe('Иван');

        const updated = await request(app)
            .put(`/api/students/${id}`)
            .send({
                first_name: 'Пётр',
                last_name: 'Иванов',
                birth_date: '2005-04-12',
                phone: '89990000002',
                email: 'petr@test.ru'
            });

        expect(updated.statusCode).toBe(200);

        const deleted = await request(app).delete(`/api/students/${id}`);
        expect(deleted.statusCode).toBe(200);

        const missing = await request(app).get(`/api/students/${id}`);
        expect(missing.statusCode).toBe(404);
    });

    // 3. CRUD преподавателей
    test('CRUD преподавателей', async () => {
        const created = await request(app)
            .post('/api/teachers')
            .send({
                first_name: 'Анна',
                last_name: 'Петрова',
                phone: '89990000003',
                email: 'teacher@test.ru',
                specialization: 'Современные танцы'
            });

        expect(created.statusCode).toBe(201);
        teacherId = created.body.id;

        const list = await request(app).get('/api/teachers');
        expect(list.statusCode).toBe(200);
        expect(list.body.some(item => item.id === teacherId)).toBe(true);

        const found = await request(app).get(`/api/teachers/${teacherId}`);
        expect(found.statusCode).toBe(200);

        const updated = await request(app)
            .put(`/api/teachers/${teacherId}`)
            .send({
                first_name: 'Анна',
                last_name: 'Сидорова',
                phone: '89990000004',
                email: 'teacher@test.ru',
                specialization: 'Балет'
            });

        expect(updated.statusCode).toBe(200);
    });

    // 4. CRUD направлений танцев
    test('CRUD направлений танцев', async () => {
        const created = await request(app)
            .post('/api/dance-styles')
            .send({
                name: 'Хип-хоп',
                description: 'Современное уличное танцевальное направление'
            });

        expect(created.statusCode).toBe(201);
        styleId = created.body.id;

        const list = await request(app).get('/api/dance-styles');
        expect(list.statusCode).toBe(200);
        expect(list.body.some(item => item.id === styleId)).toBe(true);

        const found = await request(app).get(`/api/dance-styles/${styleId}`);
        expect(found.statusCode).toBe(200);
        expect(found.body.name).toBe('Хип-хоп');

        const updated = await request(app)
            .put(`/api/dance-styles/${styleId}`)
            .send({
                name: 'Джаз-фанк',
                description: 'Современное танцевальное направление'
            });

        expect(updated.statusCode).toBe(200);
    });

    // 5. CRUD танцевальных групп
    test('CRUD танцевальных групп', async () => {
        const created = await request(app)
            .post('/api/dance-groups')
            .send({
                name: 'Начинающая группа',
                style_id: styleId,
                teacher_id: teacherId,
                age_group: '16-20',
                max_students: 15
            });

        expect(created.statusCode).toBe(201);
        groupId = created.body.id;

        const list = await request(app).get('/api/dance-groups');
        expect(list.statusCode).toBe(200);
        expect(list.body.some(item => item.id === groupId)).toBe(true);

        const found = await request(app).get(`/api/dance-groups/${groupId}`);
        expect(found.statusCode).toBe(200);

        const updated = await request(app)
            .put(`/api/dance-groups/${groupId}`)
            .send({
                name: 'Продвинутая группа',
                style_id: styleId,
                teacher_id: teacherId,
                age_group: '18-25',
                max_students: 20
            });

        expect(updated.statusCode).toBe(200);
    });

    // 6. CRUD занятий
    test('CRUD занятий', async () => {
        const created = await request(app)
            .post('/api/lessons')
            .send({
                group_id: groupId,
                lesson_date: '2026-11-20',
                start_time: '18:00',
                duration: 90,
                topic: 'Базовые движения'
            });

        expect(created.statusCode).toBe(201);
        lessonId = created.body.id;

        const list = await request(app).get('/api/lessons');
        expect(list.statusCode).toBe(200);
        expect(list.body.some(item => item.id === lessonId)).toBe(true);

        const found = await request(app).get(`/api/lessons/${lessonId}`);
        expect(found.statusCode).toBe(200);

        const updated = await request(app)
            .put(`/api/lessons/${lessonId}`)
            .send({
                group_id: groupId,
                lesson_date: '2026-11-21',
                start_time: '19:00',
                duration: 60,
                topic: 'Сложные движения'
            });

        expect(updated.statusCode).toBe(200);

        const deleted = await request(app).delete(`/api/lessons/${lessonId}`);
        expect(deleted.statusCode).toBe(200);
    });

    // 7. Удаление связанных записей
    test('Удаление группы, направления и преподавателя', async () => {
        const deletedGroup = await request(app)
            .delete(`/api/dance-groups/${groupId}`);

        expect(deletedGroup.statusCode).toBe(200);

        const deletedStyle = await request(app)
            .delete(`/api/dance-styles/${styleId}`);

        expect(deletedStyle.statusCode).toBe(200);

        const deletedTeacher = await request(app)
            .delete(`/api/teachers/${teacherId}`);

        expect(deletedTeacher.statusCode).toBe(200);
    });
});
