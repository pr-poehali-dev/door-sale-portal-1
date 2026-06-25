CREATE TABLE IF NOT EXISTS doors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    material VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    img TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO doors (name, type, material, price, width, height, img) VALUES
('Лофт Натура', 'Межкомнатные', 'Массив дуба', 24900, 80, 200, 'https://cdn.poehali.dev/projects/5b3f5f4c-2089-4e4d-8e24-9781f6cda1b4/files/032c1871-747c-4f1c-8044-4fc37970d682.jpg'),
('Скандинавия', 'Межкомнатные', 'Экошпон', 12400, 70, 200, 'https://cdn.poehali.dev/projects/5b3f5f4c-2089-4e4d-8e24-9781f6cda1b4/files/032c1871-747c-4f1c-8044-4fc37970d682.jpg'),
('Бастион Сталь', 'Входные', 'Сталь', 48700, 90, 205, 'https://cdn.poehali.dev/projects/5b3f5f4c-2089-4e4d-8e24-9781f6cda1b4/files/e2e12d35-cfc4-4bac-87b6-5d2cf2e68ce7.jpg'),
('Гранд Антик', 'Входные', 'Сталь', 62300, 96, 210, 'https://cdn.poehali.dev/projects/5b3f5f4c-2089-4e4d-8e24-9781f6cda1b4/files/e2e12d35-cfc4-4bac-87b6-5d2cf2e68ce7.jpg'),
('Минима Уайт', 'Межкомнатные', 'Эмаль', 18600, 80, 200, 'https://cdn.poehali.dev/projects/5b3f5f4c-2089-4e4d-8e24-9781f6cda1b4/files/032c1871-747c-4f1c-8044-4fc37970d682.jpg'),
('Терра Венге', 'Межкомнатные', 'Массив дуба', 31200, 90, 200, 'https://cdn.poehali.dev/projects/5b3f5f4c-2089-4e4d-8e24-9781f6cda1b4/files/032c1871-747c-4f1c-8044-4fc37970d682.jpg'),
('Форт Премиум', 'Входные', 'Сталь', 71500, 96, 210, 'https://cdn.poehali.dev/projects/5b3f5f4c-2089-4e4d-8e24-9781f6cda1b4/files/e2e12d35-cfc4-4bac-87b6-5d2cf2e68ce7.jpg'),
('Эко Лайт', 'Межкомнатные', 'Экошпон', 9900, 70, 200, 'https://cdn.poehali.dev/projects/5b3f5f4c-2089-4e4d-8e24-9781f6cda1b4/files/032c1871-747c-4f1c-8044-4fc37970d682.jpg');