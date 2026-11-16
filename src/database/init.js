
const db = require('./db');

function initDatabase() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            birth_date TEXT,
            phone TEXT,
            email TEXT UNIQUE
        );

        CREATE TABLE IF NOT EXISTS teachers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            phone TEXT,
            email TEXT UNIQUE,
            specialization TEXT
        );

        CREATE TABLE IF NOT EXISTS dance_styles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            description TEXT
        );

        CREATE TABLE IF NOT EXISTS dance_groups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            style_id INTEGER NOT NULL,
            teacher_id INTEGER NOT NULL,
            age_group TEXT,
            max_students INTEGER DEFAULT 15,
            FOREIGN KEY (style_id) REFERENCES dance_styles(id),
            FOREIGN KEY (teacher_id) REFERENCES teachers(id)
        );

        CREATE TABLE IF NOT EXISTS lessons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            group_id INTEGER NOT NULL,
            lesson_date TEXT NOT NULL,
            start_time TEXT NOT NULL,
            duration INTEGER DEFAULT 60,
            topic TEXT,
            FOREIGN KEY (group_id) REFERENCES dance_groups(id)
        );
    `);

    console.log('Все пять таблиц успешно созданы');
}

module.exports = initDatabase;

if (require.main === module) {
    initDatabase();
    db.close();
}
