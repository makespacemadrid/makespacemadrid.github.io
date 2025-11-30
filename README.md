# Página web del MakespaceMadrid

Estructura del proyecto:

- `index.html`: contenido de la página en HTML plano.
- `assets/css/`: estilos de la página web.
- `assets/js/`: código Javascript para funcionalidades como el carrusel de fotos.
- `assets/images/`: imágenes y fotos del espacio.

## Cómo modificar la web

La rama `main` está protegida. **Siempre hay que crear una Pull Request (PR)** para hacer cambios.

### Cambios pequeños (editar texto, corregir typos)

1. Ve al archivo que quieres modificar en GitHub
2. Haz clic en el icono del lápiz (Edit)
3. Haz los cambios necesarios
4. Abajo, selecciona "Create a new branch" y dale un nombre descriptivo
5. Haz clic en "Propose changes"
6. Crea la PR y espera a que alguien la revise y apruebe

### Cambios más complejos (diseño, múltiples archivos)

1. Clona el repositorio:
   ```bash
   git clone https://github.com/makespacemadrid/makespacemadrid.github.io.git
   cd makespacemadrid.github.io
   ```

2. Crea una rama nueva:
   ```bash
   git checkout -b nombre-de-tu-rama
   ```

3. Haz tus cambios y pruébalos localmente abriendo el archivo `index.html`.

4. Sube los cambios:
   ```bash
   git add .
   git commit -m "Descripción de tus cambios"
   git push origin nombre-de-tu-rama
   ```

5. Ve a GitHub y crea una PR desde tu rama hacia `main`
6. Pide que alguien revise y apruebe la PR