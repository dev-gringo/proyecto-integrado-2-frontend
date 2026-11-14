#  Cuevana 3.0 - Admin Panel (Frontend)

Panel de administración web desarrollado en **React** y **Tailwind CSS** para la gestión integral de un catálogo de películas y series, consumiendo una API REST construida en Node.js, Express y MongoDB.

##  Características Principales

* **Arquitectura Modular**: Componentes independientes para cada entidad del sistema (`Media`, `Géneros`, `Directores`, `Productoras` y `Tipos`).
* **Operaciones CRUD Completas**: Creación, lectura, actualización y eliminación (Create, Read, Update, Delete) en tiempo real mediante ventanas modales sin recarga de página.
* **Integridad Relacional**: El módulo principal de **Películas y Series (`Media`)** carga dinámicamente los registros relacionados y filtra automáticamente para mostrar únicamente **Géneros, Directores y Productoras** en estado `Activo`.
* **Interfaz Responsiva y Oscura**: Diseño moderno estilo plataforma de streaming con navegación lateral y tarjetas interactivas con vista previa de póster y enlace de reproducción.

##  Tecnologías Utilizadas

* **React.js** (Vite)
* **Tailwind CSS**
* **Fetch API** (Consumo de servicios REST)
* **JavaScript (ES6+)**

##  Requisitos Previos

Antes de ejecutar este proyecto, asegúrate de tener instalado y en ejecución:

1. **Node.js** (v18 o superior).
2. **Backend API REST** corriendo localmente en el puerto `4000` (`http://localhost:4000/api/...`) conectado a MongoDB.

##  Instalación y Ejecución Local

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/dev-gringo/proyecto-integrado-2-frontend.git
   ```

2. **Ingresar a la carpeta del proyecto:**

   ```bash
   cd proyecto-integrado-2-frontend
   ```

3. **Instalar las dependencias:**

   ```bash
   npm install
   ```

4. **Iniciar el servidor de desarrollo:**

   ```bash
   npm run dev
   ```

5. **Abrir el navegador** en la URL indicada por Vite (generalmente `http://localhost:5173`).

##  Estructura del Proyecto

```plaintext
src/
├── App.jsx           # Contenedor principal, barra lateral (Sidebar) y enrutamiento por pestañas
├── Media.jsx         # CRUD de Películas y Series con relaciones a catálogos activos
├── Generos.jsx       # CRUD de Géneros cinematográficos
├── Directores.jsx    # CRUD de Directores
├── Productoras.jsx   # CRUD de Casas Productoras
├── Tipos.jsx         # CRUD de Tipos de producción (Película, Serie, etc.)
├── main.jsx          # Punto de entrada de React
└── index.css         # Configuración de Tailwind CSS
```

##  Autores

* Stiven Arias - [@dev-gringo](https://github.com/dev-gringo)
