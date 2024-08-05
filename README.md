# Website Monitor Application

Este es un proyecto de monitoreo de sitios web utilizando Electron y Puppeteer. La aplicación permite agregar URLs para su monitoreo, y notifica a los usuarios sobre los cambios en el contenido de las páginas a través de notificaciones del sistema o por correo electrónico.

## Requisitos

- Node.js
- npm (Node Package Manager)
- Una cuenta de Gmail para enviar correos electrónicos (si se elige la opción de notificación por correo electrónico)

## Instalación

1. Clona el repositorio en tu máquina local:

    ```bash
    git clone git@github.com:dylanlopez/asia-challenge.git
    cd asia-challenge
    ```

2. Instala las dependencias del proyecto:

    ```bash
    npm install
    ```

## Configuración

1. **Configura las credenciales de Gmail**: Abre `main.js` y reemplaza las credenciales de Gmail en la sección de configuración del `transporter`:

    ```js
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tu-email@gmail.com',
        pass: 'tu-contraseña',
      },
    });
    ```

    Nota: **No olvides usar una contraseña de aplicación si tienes habilitada la verificación en dos pasos en tu cuenta de Gmail.**

2. **Modifica los permisos de `renderer.js`**: Asegúrate de que los permisos y configuraciones de seguridad se ajusten a tus necesidades.

## Uso

1. Inicia la aplicación:

    ```bash
    npm start
    ```

2. En la ventana de la aplicación, agrega URLs para monitorear ingresando la URL, el intervalo de comprobación en minutos, y seleccionando el método de notificación (sistema o correo electrónico).

3. La aplicación comenzará a monitorear las URLs proporcionadas y te notificará si detecta cambios en el contenido.

## Estructura del Proyecto

- `main.js`: Archivo principal de proceso principal de Electron.
- `renderer.js`: Código JavaScript que maneja la interfaz de usuario.
- `index.html`: Archivo HTML que define la estructura de la interfaz de usuario.
- `utils.js`: Funciones de utilidad, como la validación de URLs.
- `style.css`: Estilos CSS para la aplicación.

## Pruebas

Para ejecutar las pruebas, usa el siguiente comando:

```bash
npm test