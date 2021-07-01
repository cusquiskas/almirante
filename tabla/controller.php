<?php

class ControladorDinamicoTabla
{
    private static function setParametros(&$datos)
    {
        $cadena = '';
        foreach ($datos as &$valor) {
            $cadena .= 'private $'.$valor['Field'].";\n";
        }
        $cadena .= "private \$empty;\n";
        $cadena .= "private \$array;\n";
        $cadena .= "private \$error;\n";

        return $cadena;
    }

    private static function fncGetDatos(&$datos)
    {
        $cadena = '';
        foreach ($datos as &$valor) {
            $cadena .= ",'".$valor['Field']."' => \$this->".$valor['Field']."\n";
        }

        return $getDatos = 'private function getDatos(){return [ '.substr($cadena, 1)." ];}\n";
    }

    private static function fncSetDatos(&$datos)
    {
        $cadena = '';
        foreach ($datos as &$valor) {
            $cadena .= '$this->'.$valor['Field']." = (isset(\$array['".$valor['Field']."']) ? (".$valor['Type2'].") \$array['".$valor['Field']."'] : \$this->".$valor['Field'].");\n";
        }

        return "private function setDatos(\$array) { $cadena return 0;}\n";
    }

    private static function fncSelect(&$datos, &$tabla)
    {
        $selectDatos = '';
        $selectQuery = '';
        $i = -1;
        foreach ($datos as &$valor) {
            ++$i;
            $selectDatos .= ",$i => ['tipo' => '".$valor['Type3']."', 'dato' => \$this->".$valor['Field']."]\n";
            if ($valor['Type'] == 'date') {
                $selectQuery .= ' and IFNULL('.$valor['Field'].", \'!\') = IFNULL(STR_TO_DATE(?, \'%Y-%m-%d\'), IFNULL(".$valor['Field'].", \'!\'))\n";
            } else {
                $selectQuery .= ' and IFNULL('.$valor['Field'].", \'!\') = IFNULL(?, IFNULL(".$valor['Field'].", \'!\'))\n";
            }
        }
        $selectDatos = substr($selectDatos, 1);

        return "private function select() { \$datos = [ $selectDatos ];\n \$query = 'select * from $tabla where 1 = 1 $selectQuery';\n \$link = new ConexionSistema(); \$this->array = \$link->consulta(\$query, \$datos); \$this->error = \$link->getListaErrores(); \$status = (\$link->hayError()) ? 1 : 0; \$link->close(); unset(\$link); return \$status; }\n";
    }

    private static function fncEmptyClass()
    {
        return "private function emptyClass() { \$this->setDatos(\$this->empty); return 0; }\n";
    }

    private static function fncClearArray()
    {
        return "private function clearArray() { \$this->array = \$this->empty; return 0; }\n";
    }

    private static function fncClearError()
    {
        return "private function clearError() { \$this->error = []; return 0; }\n";
    }

    private static function fncGetArray()
    {
        return "public function getArray()    { return \$this->array; }\n";
    }

    private static function fncGetListaErrores()
    {
        return "public function getListaErrores() { return \$this->error; }\n";
    }

    private static function fncGive()
    {
        return "public function give(\$array) { \$this->emptyClass(); \$this->clearArray();\n \$this->clearError();\n \$this->setDatos(\$array);\n return \$this->select(); }\n";
    }

    private static function fncConstruct()
    {
        return "public function __construct() { \$this->empty = \$this->getDatos(); \$this->clearError(); return 0; }\n";
    }

    private static function fncInsert(&$datos, &$tabla)
    {
        $insertDatos = '';
        $insertColumn = '';
        $insertValue = '';
        $insertExtraId = '';
        $insertExtraVal = '';
        $i = -1;
        foreach ($datos as &$valor) {
            ++$i;
            if ($valor['Key'] == 'PRI' && $valor['Extra'] == 'auto_increment') {
                $insertExtraId = "if (\$status == 0) {
                                    \$key = \$link->consulta('select last_insert_id() id', []);
                                    \$this->".$valor['Field']." = $key[0]['id'];
                                }\n";
            } else {
                if ($valor['Null'] == 'NO') {
                    $insertExtraVal .= "\nif (is_null(\$this->".$valor['Field'].")) {
                                            \$this->error[] = ['tipo'=>'Validacion', 'Campo'=>'".$valor['Field']."', 'Detalle' => 'No puede ser NULO'];
                                        }";
                }
                $insertDatos .= ",$i => ['tipo' => '".$valor['Type3']."', 'dato' => \$this->".$valor['Field']."]\n";
                $insertColumn .= ','.$valor['Field'];
                if ($valor['Type'] == 'date') {
                    $insertValue .= ",STR_TO_DATE(?, \'%Y-%m-%d\')\n";
                } else {
                    $insertValue .= ",?\n";
                }
            }
        }
        $insertDatos = substr($insertDatos, 1);
        $insertColumn = substr($insertColumn, 1);
        $insertValue = substr($insertValue, 1);
        $insertExtraVal .= "\nif (count(\$this->error) > 0) return 1;\n";

        return "private function insert()
                {
                    $insertExtraVal
                    \$datos = [$insertDatos];
                    \$query = 'INSERT 
                                INTO $tabla 
                                    ($insertColumn) 
                             VALUES ($insertValue)';
                    \$link = new ConexionSistema();
                    \$link->ejecuta(\$query, \$datos);
                    \$this->error = \$link->getListaErrores();
                    \$satus = (\$link->hayError()) ? 1 : 0;
                    $insertExtraId
                    \$this->array = \$this->getDatos();
                    \$link->close();
                    unset (\$link);

                    return \$satus;
                }\n";
    }

    private static function fncUpdate(&$datos, &$tabla)
    {
        $updateDatos = '';
        $updateDatosPK = '';
        $updateColumn = '';
        $updateWhere = '';

        foreach ($datos as &$valor) {
            ++$i;
            if ($valor['Key'] == 'PRI') {
                $updateDatosPK .= ','.($i + 10)." => ['tipo' => '".$valor['Type3']."', 'dato' => \$this->".$valor['Field']."]\n";
                if ($valor['Type'] == 'date') {
                    $updateWhere .= 'and '.$valor['Field']." = STR_TO_DATE(?, \'%Y-%m-%d\')\n";
                } else {
                    $updateWhere .= 'and '.$valor['Field']." = ?\n";
                }
            } else {
                $updateDatos .= ",$i => ['tipo' => '".$valor['Type3']."', 'dato' => \$this->".$valor['Field']."]\n";
                if ($valor['Type'] == 'date') {
                    $updateColumn .= ','.$valor['Field']." = STR_TO_DATE(?, \'%Y-%m-%d\')\n";
                } else {
                    $updateColumn .= ','.$valor['Field']." = ?\n";
                }
            }
        }
        $updateDatos = substr($updateDatos, 1);
        $updateColumn = substr($updateColumn, 1);

        return "private function update()
        {
            \$datos = [
                $updateDatos
                $updateDatosPK
            ];
            \$query = 'UPDATE $tabla 
                         SET $updateColumn
                       WHERE 1 = 1
                         $updateWhere';
            \$link = new ConexionSistema();
            \$link->ejecuta(\$query, \$datos);
            \$this->error = \$link->getListaErrores();
            \$satus = (\$link->hayError()) ? 1 : 0;
            \$this->array = \$this->getDatos();
            \$link->close();
            unset (\$link);

            return \$satus;
        }";
    }

    private static function fncSave(&$datos)
    {
        $cadena = '';
        foreach ($datos as $valor) {
            if ($valor['Key'] == 'PRI') {
                $cadena .= ",'".$valor['Field']."' => \$array['".$valor['Field']."']\n";
            }
        }
        $cadena = substr($cadena, 1);

        return "public function save(\$array)
        {
            \$insert = true;
            \$this->emptyClass();
            \$arrayTemp = \$this->getArray();
            \$this->clearArray();
            \$this->clearError();
            \$arrayUpdate = [$cadena];
            if (\$this->give(\$arrayUpdate) == 0) {
                if (count(\$this->getArray()) == 1) { \$insert = false; }
            } else {
                return 1;
            }
            \$this->array = \$arrayTemp;
            \$this->setDatos(\$array);
            if (\$insert) {
                return \$this->insert();
            } else {
                return \$this->update();
            }
        }";
    }

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

        return self::reCodificaArray($datos);
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

        return $datos;
    }

    public static function set($tabla)
    {
        $clsName = "Tabla_$tabla";
        if (!class_exists($clsName)) {
            $array = self::datosTabla($tabla);

            $cadena = "class $clsName {\n";
            $cadena .= self::setParametros($array);
            $cadena .= self::fncGetDatos($array);
            $cadena .= self::fncSetDatos($array);
            $cadena .= self::fncSelect($array, $tabla);
            $cadena .= self::fncEmptyClass();
            $cadena .= self::fncClearArray();
            $cadena .= self::fncClearError();
            $cadena .= self::fncGetArray();
            $cadena .= self::fncGetListaErrores();
            $cadena .= self::fncGive();
            $cadena .= self::fncInsert($array, $tabla);
            $cadena .= self::fncUpdate($array, $tabla);
            $cadena .= self::fncSave($array);
            $cadena .= self::fncConstruct();
            $cadena .= "}\n";
            //echo var_dump($cadena, true);
            eval($cadena);
        }

        return new $clsName();
    }
}

?>

