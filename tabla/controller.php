<?php

class ControladorDinamicoTabla
{
    private static function datosTabla(&$tabla)
    {
        $link = new ConexionSistema();
        $datos = $link->consulta("desc $tabla", []);

        if ($link->hayError()) {
            $link->close();
            die(json_encode($manejador->getListaErrores()));
        }
        $link->close();
        unset($link);

        return ControladorDinamicoTabla::reCodificaArray($datos);
    }

    private static function reCodificaArray(&$datos)
    {
        $i = -1;
        foreach ($datos as &$valor) {
            ++$i;
            //$datos[$i]['Type2'] = $datos[$i]['Type'];
            $datos[$i]['Type2'] = substr($valor['Type'], 0, stripos($valor['Type'], '('));
            if ($datos[$i]['Type2'] == 'int') {
                $datos[$i]['Type3'] = 'i';
            }
            if ($datos[$i]['Type2'] == 'varchar' || $datos[$i]['Type'] == 'date') {
                $datos[$i]['Type3'] = 's';
                $datos[$i]['Type2'] = 'string';
            }
            if ($datos[$i]['Type2'] == 'decimal') {
                $datos[$i]['Type3'] = 'd';
                $datos[$i]['Type2'] = 'float';
            }
        }
        unset($valor);
        unset($i);
        //echo var_dump($datos, true);

        return $datos;
    }

    public static function set($tabla)
    {
        $clsName = "Tabla_$tabla";
        if (!class_exists($clsName)) {
            $array = ControladorDinamicoTabla::datosTabla($tabla);

            $cadena = "class $clsName { \n";
            $getDatos = '';
            $setDatos = '';
            $selectDatos = '';
            $selectQuery = '';
            $i = -1;
            foreach ($array as &$valor) {
                ++$i;
                $selectDatos .= ",$i => ['tipo' => '".$valor['Type3']."', 'dato' => \$this->".$valor['Field']."]\n";
                if ($valor['Type'] == 'date') {
                    $selectQuery .= ' and IFNULL('.$valor['Field'].", \'!\') = IFNULL(STR_TO_DATE(?, \'%Y-%m-%d\'), IFNULL(".$valor['Field'].", \'!\'))\n";
                } else {
                    $selectQuery .= ' and IFNULL('.$valor['Field'].", \'!\') = IFNULL(?, IFNULL(".$valor['Field'].", \'!\'))\n";
                }
                $cadena .= 'private $'.$valor['Field'].";\n";
                $getDatos .= ",'".$valor['Field']."' => \$this->".$valor['Field']."\n";
                $setDatos .= '$this->'.$valor['Field']." = (isset(\$array['".$valor['Field']."']) ? (".$valor['Type2'].") \$array['".$valor['Field']."'] : \$this->".$valor['Field'].");\n";
            }
            unset($valor);
            $getDatos = substr($getDatos, 1);
            $selectDatos = substr($selectDatos, 1);
            $getDatos = "private function getDatos(){return [ $getDatos ];}\n";
            $setDatos = "private function setDatos(\$array) { $setDatos return 0;}\n";
            $cadena .= "private \$empty;  \n";
            $cadena .= "private \$array;  \n";
            $cadena .= "private \$error;\n";
            $cadena .= $getDatos;
            $cadena .= $setDatos;
            $cadena .= "private function select() { \$datos = [ $selectDatos ];\n \$query = 'select * from $tabla where 1 = 1 $selectQuery';\n \$link = new ConexionSistema(); \$this->array = \$link->consulta(\$query, \$datos); \$this->error = \$link->getListaErrores(); \$status = (\$link->hayError()) ? 1 : 0; \$link->close(); return \$status; }\n";
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
            //echo "<h1>select * from $tabla where 1 = 1 $selectQuery</h1>";
            //echo var_dump($cadena, true);
            eval($cadena);
        }

        return new $clsName();
    }
}
?>

