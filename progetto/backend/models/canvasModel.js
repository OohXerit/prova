const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./canvas.sqlite');

db.run(`CREATE TABLE IF NOT EXISTS canvas_elements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    url TEXT,
    x INTEGER,
    y INTEGER
)`);

const Canvas = {
    findOne: () => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM canvas_elements", (err, rows) => {
                if (err) reject(err);
                resolve({ elements: rows });
            });
        });
    },

    save: (elements) => {
        return new Promise((resolve, reject) => {
            const stmt = db.prepare("INSERT INTO canvas_elements (type, url, x, y) VALUES (?, ?, ?, ?)");
            elements.forEach(el => {
                stmt.run(el.type, el.url, el.x, el.y);
            });
            stmt.finalize((err) => {
                if (err) reject(err);
                resolve();
            });
        });
    },

    findOneAndUpdate: (query, update) => {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM canvas_elements", (err) => {
                if (err) reject(err);
                Canvas.save(update.elements).then(() => {
                    Canvas.findOne().then(resolve).catch(reject);
                }).catch(reject);
            });
        });
    }
};

module.exports = Canvas;