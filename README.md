# almirante
Crea Clases automáticamente

Documentación de la clase.

Al importar este archivo PHP (controller.php) se está añadiendo al proyecto una clase estática que se llama ControladorDinamicoTabla. 

Dicho controlador, necesitará de los archivos de conexión y consulta con la base de datos, para poder acceder a la información de las tablas; obviamente, el proyecto debe tener dicho controlador, en caso contrario, sientanse libres de reutilizar la librería dao.php que es la uso para gestionar todas las conexiones, pero al no tratarse del objeto de estre proyecto, no lo voy a documentar (a lo mejor, más adelante, me temo que con este proyecto lo voy a tener que hacer un lavado de cara al gestor de conexiones).

Este controlador, tiene una única función pública: set. Esta función espera un único parámetro, que será el nombre de la tabla sobre la que creará la nueva clase, que tendrá las funciones necesarias para hacer una gestión eficaz de la tabla indicada. Dicha clase, quedará creada en tiempo de ejecución, por lo que no es necesario ejecutarla más de una vez por proceso, si se hace, la librería detectará que la clase ya está creada y no realizará ninguna acción adiconal salvo devolver un new de la clase, como si la acabase de construir, el nombre de la clase será "Tabla_$nombreTabla".

la clase nueva dispondrá de las siguientes funciones públicas:
- give
    > esta función espera un array asociativo con los nombres de las columnas de las tablas y los valores con los que se quiere filtrar.
    > si se quieren recuperar todos los registros, se puede pasar por parámetro un array vacío.
    > en este momento, todas las búsquedas se realizarán con un =.
    > las fechas se tratarán como un string y en la propia consulta se incluirá en una función STR_TO_DATE(?, '%Y-%m-%d')
    > en caso de que se haya podido realizar la consulta, retornará un 0, en caso de que haya habido problemas retornará un 1.
    > esta función no devuelve datos, sólo los almacena en un array privado.

- getArray
    > previamente, en algún momento, se tiene que haber ejecutado la función "give".
    > recupera un array asociativo con el contenido de todas las columas de la tabla gestionada.

- getListaErrores
    > en caso de que una función haya generado algún error, este se rellenará en un array privado y se devolverá el valor de control 1.
    > con esta función se puede recuperar el error o los errores en caso de se hayan producido más de uno.






Diario de abordo.

22.06.2021 día 000001.
La idea de la que parto, es que dada una conexión a una base de datos (MySql/MariDB), definir una función a la que se le pasará el nombre de una tabla y la función será capaz de crear una clase con las funciones básicas para manejar esa tabla:
- insertar
- borrar
- modificar
- eliminar
- consultar

Las clases se tienen que crear en tiempo de ejecución (es la gracia) de ese modo, ante eventuales cambios en la tabla, no habría que hacer nada, la función tiene que considerar siempre, que es la primera vez que se genera la clase para esa tabla.

Obviamente, aquí sólo habrá información muy genérica que será común para todas las tablas, en caso de ser necesario ampliar la funcionalidad, como debería ser obvio, deberíamos poder extender la clase con la funcionalidad adicional.

Esta será mi bitácora sobre el proyecto, iré documentando paso a paso los itos logrados.

Como en esto de Internet y PHP ya está todo inventado, he hecho una búsqueda rápida de cómo crear clases al vuelo:
https://debianhackers.net/creando-clases-y-objetos-flexibles-de-forma-dinamica-con-eval-y-arrayobject-en-php/
Maravilla de idea. Voy a empezar explotando esta idea.

23.06.2021 día 000002.
Maravilla, la clase funciona divinamente, ya puedo hacer una select del contenido de una tabla, creo que la consulta dinámica con valores decimales me está dando problemas. Habrá que revisarlo.

25.06.2021 día 000003.
Hoy toca un poco de refactorización de código, ahora tengo el controlador con una única función que se encarga de generar toda la clase, a ver, la idea de hacer sólo una vez el foreach con las columnas de una tabla, es atractiva, pero sólo he hecho la función de selección y ya se ha convertido en una locura, a si que vamos a hacer una separación por cada una de las funciones que tiene la clase, por cierto, otra cosa que voy a hacer hoy, es iniciar arriba del todo la documentación oficial de la clase, así luego no me da pereza hacerla todo de golpe.
Tabmién me ha dado tiempo de hacer la función privada de inserción, con la recuperación del valor ID de los autoincrementales y con una validación propia para los valores NULOS. La verdad, es que como ahora sólo tengo que mantener una clase.... le estoy metiendo mucha funcionalidad a la clase, lo que me debería permitir ahorrar mucho código en los controladores.
NOTA, sólo voy a documentar las clases públicas, las privadas son privadas por algo y por tanto no deben usarse, salvo que alguien quiera hacer su propia versión, obviamente.