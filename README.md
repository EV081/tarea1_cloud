# API Students (Node.js + Express + SQLite3)

## Requisitos
- Node.js 18+
- npm
- (Opcional) `sqlite3` CLI para inspeccionar la DB

## Instalación
```bash
npm install
```

## Ejecutar
```bash
npm start
# API escuchando en http://0.0.0.0:3000
```

## Probar
Importa la colección Postman `postman_collection.json` y usa la variable `base_url` (por ejemplo, `http://<IP-VM>:3000`).

## Esquema
Tabla `students(id, name, email, age)` con `email` único.
