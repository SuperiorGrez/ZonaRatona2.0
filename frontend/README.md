# ZonaRatona 2.0 — Frontend (React + Tailwind CSS + json-server)

Tienda online de videojuegos y consolas migrada de HTML a **React 18** (Vite), con diseño responsivo en
**Tailwind CSS**. Los datos viven en `db.json` y se consumen como API REST con **json-server**.

Equipo: Fabian Grez, Lucas Gajardo y Manuel Vargas.

## Cómo ejecutar
Se necesitan **dos terminales**:
```bash
npm install        # (solo la primera vez)
npm run server     # terminal 1: API json-server en http://localhost:3001
npm run dev        # terminal 2: aplicación React en http://localhost:5173
```

## Cuentas de prueba
| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Admin123` | Administrador (accede a `/admin`) |
| `lvial` | `User123` | Cliente |

Pago de prueba: cualquier tarjeta de 16 dígitos se aprueba; una tarjeta **terminada en `0002`** simula un pago rechazado.

## Datos (db.json)
| Recurso | Uso |
|---|---|
| `productos`, `categorias` | Catálogo (CRUD desde el panel admin) |
| `usuarios` | Cuentas (registro, login, activar/desactivar) |
| `ordenes` | Compras pagadas y rechazadas |
| `carritos` | Carrito de cada usuario con sesión (`id` = id del usuario) |
| `mensajes` | Formulario de contacto |

La sesión se guarda en `sessionStorage`. El carrito de un visitante sin sesión vive solo en memoria.

## Estructura
```
frontend/
├── db.json          base de datos de json-server
└── src/
    ├── App.jsx      estado compartido (sesión, catálogo, carrito) y rutas; lo entrega por props
    ├── components/  componentes reutilizables (navbar, tarjetas, formularios, tablas...)
    ├── pages/       tienda/ (vistas públicas) y admin/ (panel administrador)
    ├── services/    api.js (fetch a json-server) y un servicio por recurso
    ├── utils/       validaciones, lógica del carrito, formato, formularios
    └── data/        regiones.js (regiones y comunas de Chile)
```
