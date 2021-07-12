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
    > si se quiere realizar una operación diferente al '=', se podrá indicar con un parámetro que se llame igual que la columna que se quiere filtrar añadiendo '_signo', por ejemplo 'codart_signo' => '>='.
    > si se quiere que en las comparaciones de cadena no sean case sensitive, se podrá indicar con un parámetro que se llame igual que la columna por la que se quiere filtrar añadiendo '_case', por ejemplo 'codart_case' => 'n' (cualquier valor que no sea n/N hará que la comprobación sea case sensitive)
    > las fechas se tratarán como un string y en la propia consulta se incluirá en una función STR_TO_DATE(?, '%Y-%m-%d')
    > en caso de que se haya podido realizar la consulta, retornará un 0, en caso de que haya habido problemas retornará un 1.
    > esta función no devuelve datos, sólo los almacena en un array privado.

- getArray
    > previamente, en algún momento, se tiene que haber ejecutado la función "give".
    > recupera un array asociativo con el contenido de todas las columas de la tabla gestionada.

- getListaErrores
    > en caso de que una función haya generado algún error, este se rellenará en un array privado y se devolverá el valor de control 1.
    > con esta función se puede recuperar el error o los errores en caso de se hayan producido más de uno.

- save
    > comprobará si hay o no hay datos en la primary key, si los hay, comprobará que ya haya registro y si lo encuentra hará un update; si no lo encuentra, hará un insert
    > se realizarán las comprobaciones de ForeingKey y NotNull antes de realizar la consulta a la base de datos.

- delete
    > comprobará si la PrimaryKey esté completa, si no lo está devolverá un error.
    > comprobará si hay dependencias con el registro que se quiere borrar y si las encuentra devolverá un error.


La idea de la que parto, es que dada una conexión a una base de datos (MySql/MariDB), definir una función a la que se le pasará el nombre de una tabla y la función será capaz de crear una clase con las funciones básicas para manejar esa tabla:
- insertar
- borrar
- modificar
- eliminar
- consultar

Las clases se tienen que crear en tiempo de ejecución (es la gracia) de ese modo, ante eventuales cambios en la tabla, no habría que hacer nada, la función tiene que considerar siempre, que es la primera vez que se genera la clase para esa tabla.

Obviamente, aquí sólo habrá información muy genérica que será común para todas las tablas, en caso de ser necesario ampliar la funcionalidad, como debería ser obvio, deberíamos poder extender la clase con la funcionalidad adicional.
