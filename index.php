<?php
    session_start();
    error_reporting(E_ALL & ~E_NOTICE);

    require_once 'conex/conf.php';  //información crítica del sistema
    require_once 'conex/dao.php';   //control de comunicación con la base de datos MySQL

    header('Content-Type: application/json; charset=utf-8');

    class ControladorDinamicoTabla
    {
        private static function reCodificaArray(&$datos)
        {
            $i = 0;
            foreach ($datos as &$valor) {
                $datos[$i]['Type2'] = substr($valor['Type'], 0, stripos($valor['Type'], '('));
                if ($datos[$i]['Type2'] == 'int') {
                    $datos[$i]['Type3'] = 'i';
                }
                if ($datos[$i]['Type2'] == 'varchar') {
                    $datos[$i]['Type3'] = 's';
                    $datos[$i]['Type2'] = 'string';
                }
                if ($datos[$i]['Type2'] == 'decimal') {
                    $datos[$i]['Type3'] = 'd';
                    $datos[$i]['Type2'] = 'float';
                }
                ++$i;
            }
            unset($valor);
            unset($i);

            return $datos;
        }

        public static function set($tabla, $array = [])
        {
            $clsName = "Tabla_$tabla";
            if (!class_exists($clsName)) {
                $array = ControladorDinamicoTabla::reCodificaArray($array);

                $cadena = "class $clsName { \n";
                $getDatos = '';
                $setDatos = '';
                $selectDatos = '';
                $selectQuery = '';
                $i = -1;
                foreach ($array as &$valor) {
                    ++$i;
                    $selectDatos .= ",$i => ['tipo' => '".$valor['Type3']."', 'dato' => \$this->".$valor['Field']."]\n";
                    $selectQuery .= 'and '.$valor['Field'].' = IFNULL(?, '.$valor['Field'].")\n";
                    $cadena .= 'private $'.$valor['Field'].";\n";
                    $getDatos .= ",'".$valor['Field']."' => \$this->".$valor['Field']."\n";
                    $setDatos .= '$this->'.$valor['Field']." = (isset(\$array['".$valor['Field']."']) ? (".$valor['Type2'].") \$array['".$valor['Field']."'] : \$this->".$valor['Field'].");\n";
                }
                $getDatos = substr($getDatos, 1);
                $selectDatos = substr($selectDatos, 1);
                $getDatos = "private function getDatos(){return [ $getDatos ];}\n";
                $setDatos = "private function setDatos(\$array) { $setDatos return 0;}\n";
                unset($valor);
                $cadena .= "private \$empty;  \n";
                $cadena .= "private \$array;  \n";
                $cadena .= "private \$error;\n";
                $cadena .= $getDatos;
                $cadena .= $setDatos;
                $cadena .= "private function select() { \$datos = [ $selectDatos ]; \$query = 'select * from $tabla where 1 = 1 $selectQuery'; \$link = new ConexionSistema(); \$this->array = \$link->consulta(\$query, \$datos); \$this->error = \$link->getListaErrores(); \$status = (\$link->hayError()) ? 1 : 0; \$link->close(); return \$status; }\n";
                $cadena .= "private function emptyClass() { \$this->setDatos(\$this->empty); return 0; }\n";
                $cadena .= "private function clearArray() { \$this->array = \$this->empty; return 0; }\n";
                $cadena .= "public function getArray()    { return \$this->array; }\n";
                $cadena .= "public function getListaErrores() { return \$this->error; }\n";
                $cadena .= "public function give(\$array) { \$this->emptyClass(); \$this->clearArray(); \$this->setDatos(\$array); return \$this->select(); }\n";
                $cadena .= "\n";
                $cadena .= "\n";
                $cadena .= "\n";
                $cadena .= "public function __construct() { \$this->empty = \$this->getDatos(); return 0; }\n";
                $cadena .= "} \n";
                //echo var_dump($cadena, true);
                eval($cadena);
            }

            return new $clsName();
        }
    }

    //echo '{"success":true}';

    $tablaObjeto = 'ESPECIFICACION';
    $link = new ConexionSistema();
    $datos = $link->consulta("desc $tablaObjeto", []);
    $link->close();

    $manejador = ControladorDinamicoTabla::set($tablaObjeto, $datos);
    $manejador->give([]);
    //echo var_dump($datos, true);
    //echo '<ln>';
    echo json_encode($manejador->getArray());

    unset($manejador);
    unset($link);

?>

