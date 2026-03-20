# Propuesta de Batería Mínima de Tests para el Frontend de Mercanto

Este documento detalla una propuesta de batería mínima de tests para las funcionalidades críticas del frontend de Mercanto, con el objetivo de asegurar la calidad y fiabilidad de la aplicación. Se enfoca en los flujos de usuario más importantes: autenticación (login), gestión del carrito de compras, proceso de checkout y la interfaz de administración.

## 1. Tests de Autenticación (Login)

Los tests de login deben verificar que los usuarios pueden iniciar y cerrar sesión correctamente, y que los mecanismos de seguridad funcionan como se espera.

| ID Test | Descripción del Test | Pasos | Resultado Esperado |
| :------ | :------------------- | :---- | :----------------- |
| **AUTH-001** | **Login exitoso con credenciales válidas** | 1. Navegar a la página de login. \n 2. Ingresar email y contraseña válidos. \n 3. Hacer clic en el botón "Ingresar". | El usuario es redirigido a la página de inicio (o dashboard si es admin) y su estado de sesión se actualiza correctamente. |
| **AUTH-002** | **Login fallido con credenciales inválidas** | 1. Navegar a la página de login. \n 2. Ingresar email válido y contraseña inválida (o viceversa). \n 3. Hacer clic en el botón "Ingresar". | Se muestra un mensaje de error claro indicando credenciales inválidas. El usuario permanece en la página de login. |
| **AUTH-003** | **Redirección a login para rutas protegidas** | 1. Intentar navegar directamente a una ruta protegida (ej. `/perfil`, `/admin`) sin haber iniciado sesión. | El usuario es redirigido automáticamente a la página de login. |
| **AUTH-004** | **Cierre de sesión (Logout) exitoso** | 1. Iniciar sesión con credenciales válidas. \n 2. Hacer clic en el botón "Cerrar sesión" en la barra de navegación/perfil. | El usuario es redirigido a la página de inicio (o login) y su estado de sesión se elimina. No puede acceder a rutas protegidas. |
| **AUTH-005** | **Registro de nuevo usuario exitoso** | 1. Navegar a la página de registro. \n 2. Completar todos los campos con datos válidos y únicos. \n 3. Seleccionar un rol (Comprador/Vendedor). \n 4. Hacer clic en "Crear cuenta". | El usuario es registrado, inicia sesión automáticamente y es redirigido a la página de inicio. |
| **AUTH-006** | **Registro de usuario con email ya existente** | 1. Navegar a la página de registro. \n 2. Intentar registrarse con un email que ya existe en el sistema. | Se muestra un mensaje de error indicando que el email ya está registrado. |

## 2. Tests de Carrito de Compras

Estos tests aseguran que el carrito de compras funciona correctamente, permitiendo a los usuarios añadir, actualizar y eliminar productos.

| ID Test | Descripción del Test | Pasos | Resultado Esperado |
| :------ | :------------------- | :---- | :----------------- |
| **CART-001** | **Añadir producto al carrito** | 1. Navegar a la página de una tienda o producto. \n 2. Hacer clic en "Añadir al carrito" para un producto. | El producto se añade al carrito, el contador de ítems en el icono del carrito se actualiza y el panel lateral del carrito muestra el producto. |
| **CART-002** | **Aumentar cantidad de producto en carrito** | 1. Añadir un producto al carrito. \n 2. En el panel del carrito, hacer clic en el botón "+" para el producto. | La cantidad del producto aumenta, el subtotal del producto y el total del carrito se actualizan. |
| **CART-003** | **Disminuir cantidad de producto en carrito** | 1. Añadir un producto al carrito con cantidad > 1. \n 2. En el panel del carrito, hacer clic en el botón "-" para el producto. | La cantidad del producto disminuye, el subtotal del producto y el total del carrito se actualizan. |
| **CART-004** | **Eliminar producto del carrito** | 1. Añadir un producto al carrito. \n 2. En el panel del carrito, hacer clic en el botón "Eliminar" (icono de papelera) para el producto. | El producto se elimina del carrito, el contador de ítems y el total del carrito se actualizan. |
| **CART-005** | **Vaciar carrito** | 1. Añadir varios productos al carrito. \n 2. Eliminar todos los productos uno por uno o buscar una opción de vaciado (si existe). | El carrito muestra el estado "Tu carrito está vacío". |
| **CART-006** | **Regla anti-mezcla de tiendas** | 1. Añadir un producto de la Tienda A al carrito. \n 2. Intentar añadir un producto de la Tienda B al carrito. | Se muestra una alerta o mensaje indicando que no se pueden añadir productos de diferentes tiendas. El producto de la Tienda B no se añade. |
| **CART-007** | **Navegar a checkout desde el carrito** | 1. Añadir al menos un producto al carrito. \n 2. Hacer clic en el botón "Proceder al pedido" en el panel del carrito. | El usuario es redirigido a la página de checkout con los productos del carrito precargados. |

## 3. Tests de Checkout

Estos tests verifican el flujo completo de compra, desde la confirmación del pedido hasta la visualización del éxito.

| ID Test | Descripción del Test | Pasos | Resultado Esperado |
| :------ | :------------------- | :---- | :----------------- |
| **CHCK-001** | **Checkout exitoso (Recojo en tienda)** | 1. Iniciar sesión. \n 2. Añadir productos al carrito. \n 3. Navegar a la página de checkout. \n 4. Completar los datos de contacto (nombre, teléfono). \n 5. Seleccionar "Recojo en tienda". \n 6. Hacer clic en "Confirmar pedido". | Se muestra la página de éxito con el mensaje "¡Pedido Recibido!" y los detalles del pedido. El carrito se vacía. |
| **CHCK-002** | **Validación de campos requeridos** | 1. Iniciar sesión y añadir productos al carrito. \n 2. Navegar a la página de checkout. \n 3. Intentar confirmar el pedido sin rellenar campos obligatorios (ej. nombre, teléfono). | Se muestran mensajes de error claros para cada campo faltante. El pedido no se procesa. |
| **CHCK-003** | **Acceso a checkout sin autenticar** | 1. Sin iniciar sesión, intentar navegar a la página de checkout. | El usuario es redirigido a la página de login/registro con un mensaje indicando que necesita autenticarse. |
| **CHCK-004** | **Acceso a checkout con carrito vacío** | 1. Iniciar sesión. \n 2. Asegurarse de que el carrito está vacío. \n 3. Navegar a la página de checkout. | Se muestra un mensaje indicando "No hay pedido en curso" y un botón para volver al inicio. |
| **CHCK-005** | **Redirección desde página de éxito** | 1. Completar un checkout exitoso. \n 2. En la página de éxito, hacer clic en "Volver al inicio". | El usuario es redirigido a la página principal de la aplicación. |

## 4. Tests de Administración (Admin Page)

Estos tests cubren las funcionalidades clave del panel de administración, asegurando que los administradores pueden gestionar tiendas y pedidos.

| ID Test | Descripción del Test | Pasos | Resultado Esperado |
| :------ | :------------------- | :---- | :----------------- |
| **ADM-001** | **Acceso a panel de admin (rol admin)** | 1. Iniciar sesión con un usuario con rol `admin`. \n 2. Navegar a la ruta `/admin`. | El usuario accede al panel de administración y ve el dashboard. |
| **ADM-002** | **Acceso denegado a panel de admin (rol no admin)** | 1. Iniciar sesión con un usuario con rol `buyer` o `seller`. \n 2. Intentar navegar a la ruta `/admin`. | El usuario es redirigido a la página de inicio o se muestra un mensaje de acceso denegado. |
| **ADM-003** | **Navegación entre pestañas del admin** | 1. Acceder al panel de admin. \n 2. Hacer clic en las pestañas "Dashboard", "Tiendas" y "Pedidos". | El contenido de cada pestaña se carga y muestra correctamente. |
| **ADM-004** | **Aprobar una tienda pendiente** | 1. Acceder al panel de admin, pestaña "Tiendas". \n 2. Filtrar por tiendas "Pendientes". \n 3. Hacer clic en "Aprobar" para una tienda. | La tienda cambia su estado a "Aprobada". Se muestra un toast de éxito. La tienda desaparece de la lista de pendientes. |
| **ADM-005** | **Rechazar una tienda pendiente** | 1. Acceder al panel de admin, pestaña "Tiendas". \n 2. Filtrar por tiendas "Pendientes". \n 3. Hacer clic en "Rechazar" para una tienda. | La tienda cambia su estado a "Rechazada". Se muestra un toast de éxito. La tienda desaparece de la lista de pendientes. |
| **ADM-006** | **Paginación de tiendas** | 1. Acceder al panel de admin, pestaña "Tiendas". \n 2. Verificar que los botones de paginación (`<` y `>`) funcionan correctamente, navegando entre las páginas de tiendas. | La lista de tiendas se actualiza con los resultados de la página correspondiente. Los botones de paginación se habilitan/deshabilitan según sea necesario. |
| **ADM-007** | **Filtrado de pedidos por estado** | 1. Acceder al panel de admin, pestaña "Pedidos". \n 2. Seleccionar diferentes estados en el filtro (ej. "Pendientes", "Entregados"). | La tabla de pedidos se actualiza mostrando solo los pedidos con el estado seleccionado. |
| **ADM-008** | **Cierre de sesión desde el panel de admin** | 1. Acceder al panel de admin. \n 2. Hacer clic en el botón "Cerrar sesión" en el sidebar. | El usuario es redirigido a la página de inicio (o login) y su sesión de admin se cierra. |

--- 

**Nota:** Esta es una batería mínima. Para una cobertura completa, se recomienda añadir tests de integración, tests de componentes y tests de rendimiento, así como explorar herramientas de testing automatizado como Cypress o Playwright para simular interacciones de usuario de forma más robusta. Además, se sugiere implementar un sistema de CI/CD que ejecute estos tests automáticamente en cada cambio de código.))

--- 

**Nota:** Esta es una batería mínima. Para una cobertura completa, se recomienda añadir tests de integración, tests de componentes y tests de rendimiento, así como explorar herramientas de testing automatizado como Cypress o Playwright para simular interacciones de usuario de forma más robusta. Además, se sugiere implementar un sistema de CI/CD que ejecute estos tests automáticamente en cada cambio de código. 
