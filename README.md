# almirante
Crea Clases automáticamente

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