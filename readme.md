# bcv-scrapper-aws
paquete serverless para la extracción de los montos de conversión del banco central de venezuela. Ejecutandose una vez al día posterior a la actualización de estos. Actualmente limitado a ejecutarse por el desencadenamiento de un evento de AWS EventBridge ejecutado todos los días a las 21 horas UTC. 
## Procedimientos para ejecutar en un entorno local: 
`git clone https://github.com/kurokuro15/bcv-scrapper-aws.git`
## Procedimientos para ejecutar en un entorno AWS: 
Para levantar la lambda function: 
- Copiar el repositorio localmente

	`git clone https://github.com/kurokuro15/bcv-scrapper-aws.git`
- Instalar las dependencias de node

	`npm install`
- Se ha de renombrar el archivo ``config.js.example`` como `config.js`
configurando a su vez las variables internas `SB_URL`, `SB_SERVICE_KEY` 
donde `SB_URL` será la url de acceso al proyecto de _supabase_ en donde el scrapper almacenará los datos y `SB_SERVICE_KEY` será el __JWT__ de servicio que otorga _Supabase_ para acceder como ___manteiner___.
- Crear un archivo `layer.zip` con la siguiente estructura: 
	~~~
	layer.zip
	 └ nodejs/
	  └ node_modules/*
	~~~
	_almacenando todas las dependencias de node_modules en dicho archivo `.zip`_
- Crear un archivo `function.zip` donde se almacenará la lambda function:
	~~~~
	function.zip
		├ config.js
		├ currencies.json
		├ declarations.js
		├ index.js
		├ package.json
	~~~~
- Acceder a la consola de AWS S3 y crear un bucket. 
	- Almacenar ambos archivos comprimidos en este bucket.
- Acceder a la consola de AWS Lambda Functions. 	
- Acceder al apartado de capas y crear una capa.
	- Crearla a partir del enlace de S3 del `layer.zip`.
	- Indicar como __runtime__ `nodejs 12.x`, `nodejs 14.x` y `nodejs 16.x`
- Acceder a la opción de funciones y crear una función. 
	-	Crear a partir de una función vacía.
	- Identificar 
	- Indicar como __runtime__ `nodejs 12.X`
	- Una vez creada, acceder a esta y cargar código fuente a través de enlace de S3. Utilizar el enlace a ``function.zip`` ubicado en tú bucket de S3. 
	- Después de cargar el `.zip` accedemos a __configuración__ y ubicamos las variables de entorno o `Environment Variables`. 
	- Crear una variable `NODE_PATH = '/opt/nodejs/node_modules' `
	- Asignar la `layer` creada previamente. 

Con esto tenemos listo la configuración principal de la función lambda.
## __Ahora toca hacer el trigger por tiempo.__
Para esto se agrega un disparador a la función.
- Acceder a la función y crear un desencadenador.
- Selecionar eventBridge y crear una nueva regla.
- Utilizar expresión de programación
- Utilizamos una expresión cron de la forma:
~~~~
cron(Minutes Hours Day-of-month Month Day-of-week Year)
rate(5 minutes) // cada 5 minutos
cron(0 5 * * ? *) // a las 5:00 de cada día 
~~~~
- Finalizamos la configuración y tendríamos todo listo para la auto ejecución.
- Se puede crear un test sin cuerpo para probar su funcionamiento. 

Es importante utilizar NodeJS 12.X en AWS Lambda Functions

