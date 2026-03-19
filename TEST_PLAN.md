# Propuesta de Batería Mínima de Tests - Mercanto

Para asegurar la calidad del frontend de Mercanto, se propone implementar la siguiente batería de pruebas utilizando **Vitest** y **React Testing Library** para pruebas unitarias/componentes, y **Playwright** o **Cypress** para pruebas de extremo a extremo (E2E).

## 1. Módulo de Autenticación (Login)
| Caso de Prueba | Tipo | Descripción |
| :--- | :--- | :--- |
| **Login Exitoso** | E2E | El usuario ingresa credenciales válidas y es redirigido al Home. |
| **Validación de Campos** | Unitario | Verificar que el formulario muestre errores si el email no es válido o la contraseña está vacía. |
| **Manejo de Errores** | Integración | Mostrar mensaje de error cuando la API devuelve 401 (credenciales incorrectas). |
| **Persistencia de Sesión** | E2E | Al recargar la página, el usuario debe mantenerse autenticado (localStorage/cookies). |

## 2. Carrito de Compras
| Caso de Prueba | Tipo | Descripción |
| :--- | :--- | :--- |
| **Agregar Producto** | Integración | Al hacer clic en "Agregar", el contador del Navbar debe incrementarse y el producto aparecer en el Drawer. |
| **Persistencia del Carrito** | Unitario | El contenido del carrito debe persistir tras recargar la página. |
| **Modificar Cantidades** | Unitario | Botones de `+` y `-` deben actualizar el subtotal y total correctamente. |
| **Eliminar Producto** | Unitario | El producto debe desaparecer del carrito al hacer clic en eliminar. |

## 3. Proceso de Checkout
| Caso de Prueba | Tipo | Descripción |
| :--- | :--- | :--- |
| **Acceso Restringido** | E2E | Usuarios no autenticados deben ser redirigidos al Login al intentar entrar a `/pedido`. |
| **Validación de Formulario** | Unitario | Impedir el envío si faltan campos obligatorios (nombre, teléfono, dirección). |
| **Flujo Completo de Compra** | E2E | Desde agregar un producto hasta ver la pantalla de "¡Pedido Recibido!". |
| **Limpieza de Carrito** | Integración | El carrito debe quedar vacío después de una orden exitosa. |

## 4. Panel de Administración (Admin)
| Caso de Prueba | Tipo | Descripción |
| :--- | :--- | :--- |
| **Protección de Ruta** | E2E | Usuarios con rol `buyer` no deben poder acceder a `/admin`. |
| **Gestión de Tiendas** | Integración | Probar las acciones de "Aprobar" y "Rechazar" tiendas pendientes. |
| **Visualización de Pedidos** | Integración | Verificar que la lista de pedidos cargue correctamente y muestre los estados actualizados. |
| **Filtros y Paginación** | Unitario | Los filtros por estado y la navegación entre páginas deben actualizar la lista de datos. |

---

## Recomendaciones Técnicas
1. **Mock Service Worker (MSW):** Para interceptar llamadas a la API en pruebas unitarias e integración.
2. **A11y Testing:** Integrar `jest-axe` para detectar problemas de accesibilidad automáticamente en los componentes.
3. **CI/CD:** Ejecutar la suite de tests en cada Pull Request para evitar regresiones.
