# Proyecto-cloud
## Configuración Frontend
### Características
- **Lenguaje:** JavaScript
- **Framework:** React

## Comandos iniciales
Primero creamos el proyecto de React.

``` bash
npx create-react-app modelo-recomendacion-productos
```

Después, accedemos a la página de Firebase para crear una cuenta. A continuación, creamos un nuevo proyecto en la consola de Firebase, lo que nos permitirá utilizar todas las funcionalidades que ofrece la plataforma. Aquí podremos incializar las funcionalidades de Hosting y Authentication.

## Hosting
El host elegido para nuetsra web es Firebase Hosting porque es gratuito y permite monitorear el tráfico que recibe una web en tiempo real.

![imagen1](https://github.com/user-attachments/assets/7361b9bb-387b-47f7-939b-7bd442c78261)

Además incluye un dominio personalizable.

![imagen2](https://github.com/user-attachments/assets/4ceaeee5-2a45-46d0-9f12-1fee5780a529)

## Configuración de Firebase
Agregamos el apikey entre otras llaves necesarias para manejar el registro de los usuarios y el acceso por medio del Login.

![imagen4](https://github.com/user-attachments/assets/0e2789a7-5c39-451b-8404-1717ee2f71d2)

## Firebase Auth
Configuramos Firebase Auth por medio de un correo electrónico para crear un token único para cada usuario registrado.

![imagen3](https://github.com/user-attachments/assets/0f837312-fe63-4595-9cd5-58f2277a60c5)

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
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

EXPOSE 8000

CMD ["python", "app.py"]
```
### Azure Container Registry
El contenedor Docker se subió a Azure Container Registry (ACR), que permite almacenar y administrar imágenes de contenedores en un registro privado.
![Container](https://github.com/NicolasFG/Proyecto-cloud/blob/main/back/containerazure.PNG)

### Kubernetes 
El contenedor Docker se desplegó en un clúster de Kubernetes en Azure Kubernetes Service (AKS). Se utilizaron despliegues y servicios para gestionar los pods y exponer la API.
![Kubernetes](https://github.com/NicolasFG/Proyecto-cloud/blob/main/back/kubernetesazure.PNG)

### Azure API Management
Para exponer la API de manera segura y gestionada, se utilizó Azure API Management, proporcionando un endpoint HTTPS y otras funcionalidades de gestión.
![APIM](https://github.com/NicolasFG/Proyecto-cloud/blob/main/back/APIMazure.PNG)

## Experimentaciones
Se utilizó JMeter para realizar pruebas de carga en la API con el objetivo de evaluar su rendimiento y capacidad de escalabilidad. JMeter es una herramienta de código abierto diseñada para probar el rendimiento de aplicaciones web. Nos permitió simular múltiples usuarios concurrentes enviando solicitudes a la API, lo que ayudó a identificar cómo se comporta la API bajo alta demanda. Estas pruebas son cruciales para garantizar que la API pueda manejar situaciones de carga pesada sin fallar y para identificar cuellos de botella en el rendimiento.

## Configuración de JMeter
La configuración de JMeter se estableció para simular 100 hilos (usuarios virtuales) que se incrementan durante un período de 10 segundos. Esto se logró configurando el "Número de Hilos" en 100 y el "Período de Subida" en 10 segundos. Esta configuración fue elegida para generar una carga significativa sobre la API en un corto período de tiempo, lo que permite observar cómo se comporta la API bajo estrés y si puede manejar el incremento repentino en la demanda. Además, el "Contador del Bucle" se configuró en 100 para que cada hilo realice múltiples iteraciones, simulando un uso continuo de la API.

### KEDA
KEDA (Kubernetes-based Event Driven Autoscaling) se implementó para permitir la escalabilidad horizontal de la API basada en eventos. KEDA permite escalar los pods automáticamente en respuesta a la demanda de la aplicación. Para configurar KEDA, se creó un objeto escalado (ScaledObject) en el que se especificaron los parámetros de escalabilidad. La configuración incluyó el intervalo de sondeo de 30 segundos y un período de recuperación de 300 segundos, con un mínimo de 2 réplicas y un máximo de 100 réplicas. 


![](https://github.com/NicolasFG/Proyecto-cloud/blob/main/back/Jmeter1.PNG)



Sin KEDA
La primera gráfica muestra el comportamiento de la API sin KEDA implementado. Cuando la API fue estresada, colapsó a los 3 segundos, como se observa en las gráficas de uso de CPU y memoria, así como en el recuento de pods activos.

![](https://github.com/NicolasFG/Proyecto-cloud/blob/main/back/test1.1.PNG)

* Uso de CPU: Se observa un pico que colapsa rápidamente, indicando que la carga era demasiado alta para ser manejada por los recursos disponibles.
* Uso de Memoria: La memoria muestra una carga constante que no pudo soportar, lo que llevó a un fallo en la aplicación.
* Recuento de Pods Activos: Muestra un incremento en los pods con errores, ya que los recursos no pudieron escalar adecuadamente para manejar la carga.


Con KEDA
![](https://github.com/NicolasFG/Proyecto-cloud/blob/main/back/test2.PNG)

La segunda gráfica muestra una mejora significativa después de implementar KEDA. La API pudo manejar la carga durante 7 segundos antes de fallar, lo que evidencia una mejora en la escalabilidad. Esto demuestra que con KEDA, los recursos pueden escalar dinámicamente en respuesta a la demanda, mejorando el rendimiento general y la estabilidad de la API.

![](https://github.com/NicolasFG/Proyecto-cloud/blob/main/back/test2.2.PNG)

* Uso de CPU: Se mantiene más estable con un pico sostenido, indicando que la API pudo manejar la carga mejor gracias a la capacidad de escalado automático proporcionada por KEDA.
* Uso de Memoria: Mejora en la gestión de la carga, evitando los fallos que se observaron sin KEDA.
* Recuento de Pods Activos: Se observa una mejor distribución y manejo de los pods activos, con un menor número de errores gracias a la capacidad de escalar adecuadamente.

## Conclusión
La implementación de KEDA en el clúster de Kubernetes permitió una mejor escalabilidad de la API, como se evidencia en las pruebas de carga realizadas con JMeter y monitorizadas con las herramientas de Azure. Las pruebas demostraron que la API puede manejar incrementos significativos en la carga con una degradación mínima del rendimiento cuando se utilizan estrategias de escalabilidad adecuadas. Esto asegura que la API sea robusta y esté preparada para entornos de producción con demandas variables.







