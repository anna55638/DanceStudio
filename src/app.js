
const express = require('express');

const initDatabase = require('./database/init');

initDatabase();

const app = express();

app.use(express.json());

// Ученики
const studentsRoutes = require('./routes/students');
app.use('/api/students', studentsRoutes);

// Преподаватели
const teachersRoutes = require('./routes/teachers');
app.use('/api/teachers', teachersRoutes);

// Направления танцев
const danceStylesRoutes = require('./routes/danceStyles');
app.use('/api/dance-styles', danceStylesRoutes);

// Танцевальные группы
const danceGroupsRoutes = require('./routes/danceGroups');
app.use('/api/dance-groups', danceGroupsRoutes);

// Занятия
const lessonsRoutes = require('./routes/lessons');
app.use('/api/lessons', lessonsRoutes);

// Проверка работы API
app.get('/', (req, res) => {
    res.json({
        message: 'DanceStudio API работает!'
    });
});

module.exports = app;
