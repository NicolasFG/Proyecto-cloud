# Proyecto-cloud

## API Recomendaciones
La API fue desarrollada inicialmente en Python. Su propósito es manejar solicitudes HTTP de manera eficiente y escalable.

### Características
- **Lenguaje:** Python
- **Framework:** Flask/Django 
- **Funcionalidades:**

## Configuración Inicial

### Docker
Se creó un Dockerfile para contenerizar la aplicación. Esto permitió que la API se ejecute de manera aislada y replicable en cualquier entorno. Se configuro el siguiente DockerFile.

```Dockerfile

```
### Azure Container Registry
El contenedor Docker se subió a Azure Container Registry (ACR), que permite almacenar y administrar imágenes de contenedores en un registro privado.


### Kubernetes 
El contenedor Docker se subió a Azure Container Registry (ACR), que permite almacenar y administrar imágenes de contenedores en un registro privado.

### Azure API Management
Para exponer la API de manera segura y gestionada, se utilizó Azure API Management, proporcionando un endpoint HTTPS y otras funcionalidades de gestión.

## Experimentaciones

### KEDA
KEDA (Kubernetes-based Event Driven Autoscaling) se implementó para permitir la escalabilidad horizontal de la API basada en eventos. KEDA permite escalar los pods automáticamente en respuesta a la demanda de la aplicación.

Sin KEDA
La primera gráfica muestra el comportamiento de la API sin KEDA implementado. Cuando la API fue estresada, colapsó a los 3 segundos, como se observa en las gráficas de uso de CPU y memoria, así como en el recuento de pods activos.


Uso de CPU: Se observa un pico que colapsa rápidamente.
Uso de Memoria: Muestra una carga constante que no pudo soportar.
Recuento de Pods Activos: Muestra un incremento en los pods con errores.


Con KEDA
La segunda gráfica muestra la mejora después de implementar KEDA. La API pudo manejar la carga durante 7 segundos antes de fallar, evidenciando una mejora en la escalabilidad.


Uso de CPU: Se mantiene más estable con un pico sostenido.
Uso de Memoria: Mejora en la gestión de la carga.
Recuento de Pods Activos: Se observa una mejor distribución y manejo de los pods activos.










