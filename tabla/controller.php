<?php

class ControladorDinamicoTabla
{
    private static function setParametros(&$datos)
    {
        $cadena = '';
        foreach ($datos as &$valor) {
            $cadena .= 'private $'.$valor['Field']." = null;\n";
            $cadena .= 'private $'.$valor['Field']."_signo = '=';\n";
            $cadena .= 'private $'.$valor['Field']."_case = 'S';\n";
        }
        $cadena .= "private \$empty;\n";
        $cadena .= "private \$array = [];\n";
        $cadena .= "private \$error = [];\n";

        return $cadena;
    }

    private static function fncGetDatos(&$datos)
    {
        $cadena = '';
        foreach ($datos as &$valor) {
            $cadena .= ",'".$valor['Field']."' => \$this->".$valor['Field']."\n";
        }

        return $getDatos = 'public function getDatos(){return [ '.substr($cadena, 1)." ];}\n";
    }

    private static function fncSetDatos(&$datos)
    {
        $cadena = '';
        foreach ($datos as &$valor) {
            $cadena .= '$this->'.$valor['Field']." =       (array_key_exists('".$valor['Field']."',       \$array) ? (strlen(\$array['".$valor['Field']."']==0)?null:(".$valor['Type2'].") \$array['".$valor['Field']."']) : \$this->".$valor['Field'].");\n";
            $cadena .= '$this->'.$valor['Field']."_signo = (array_key_exists('".$valor['Field']."_signo', \$array) ? (string) \$array['".$valor['Field']."_signo'] : '=');\n";
            $cadena .= '$this->'.$valor['Field']."_case  = (array_key_exists('".$valor['Field']."_case',  \$array) ? (string) strtoupper(\$array['".$valor['Field']."_case']) : 'S');\n";
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
            if ($valor['Type'] == 'date'):
                $selectQuery .= ' and IFNULL('.$valor['Field'].", '!') \$this->".$valor['Field']."_signo IFNULL(STR_TO_DATE(?, '%Y-%m-%d'), IFNULL(".$valor['Field'].", '!'))\n";
            elseif ($valor['Type'] == 'datetime'):
                $selectQuery .= ' and IFNULL('.$valor['Field'].", '!') \$this->".$valor['Field']."_signo IFNULL(STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s'), IFNULL(".$valor['Field'].", '!'))\n";
            else:
                if ($valor['Type3'] == 's') {
                    $selectQuery .= ' and IFNULL($'.$valor['Field'].'_upperI '.$valor['Field'].' $'.$valor['Field']."_upperF , '!') \$this->".$valor['Field'].'_signo IFNULL( $'.$valor['Field'].'_upperI ? $'.$valor['Field'].'_upperF , IFNULL('.$valor['Field'].", '!'))\n";
                    $variablesInternas .= '$'.$valor['Field'].'_upperI = ($this->'.$valor['Field']."_case == 'N')?'UPPER(':'';\n";
                    $variablesInternas .= '$'.$valor['Field'].'_upperF = ($this->'.$valor['Field']."_case == 'N')?')':'';\n";
                } else {
                    $selectQuery .= ' and IFNULL('.$valor['Field'].", '!') \$this->".$valor['Field'].'_signo IFNULL( ? , IFNULL('.$valor['Field'].", '!'))\n";
                }
            endif;
        }
        $selectDatos = substr($selectDatos, 1);

        return "private function select() { 
            \$status = 0;
            $variablesInternas\n
            \$datos = [ $selectDatos ];\n
            \$query = \"select * from $tabla where 1 = 1 \n$selectQuery\";
            \$link = new ConexionSistema(); 
            \$this->array = \$link->consulta(\$query, \$datos); 
            if (\$link->hayError()) {
                \$status = 1;
                \$this->error = \$link->getListaErrores(); 
            }
            \$link->close(); 
            unset(\$link); 
            return \$status; 
        }\n";
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
                                    \$this->".$valor['Field']." = \$key[0]['id'];
                                }\n";
            } else {
                if ($valor['Null'] == 'NO') {
                    $insertExtraVal .= "\nif (is_null(\$this->".$valor['Field'].")) {
                        \$this->error[] = ['tipo'=>'Validacion', 'Campo'=>'".$valor['Field']."', 'Detalle' => 'No puede ser NULO'];
                    }";
                }
                $insertDatos .= ",$i => ['tipo' => '".$valor['Type3']."', 'dato' => \$this->".$valor['Field']."]\n";
                $insertColumn .= ','.$valor['Field'];
                if ($valor['Type'] == 'date'):
                    $insertValue .= ",STR_TO_DATE(?, '%Y-%m-%d')\n";
                elseif ($valor['Type'] == 'datetime'):
                        $insertValue .= ",STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s')\n";
                else:
                    $insertValue .= ",?\n";
                endif;
            }
        }
        unset($valor);
        $referencias = self::referenciasTabla($tabla);
        $dependencias = '';
        foreach ($referencias as &$valor) {
            $dependencias .= "if (!is_null(\$this->".$valor['columnaOri'].")) {";
            $dependencias .= "\$key = \$link->consulta('select count(0) as cuenta from ".$valor['tablaRef'].' where '.$valor['columnaRef']." = \''.\$this->".$valor['columnaOri'].".'\'', []);\n";
            $dependencias .= "if (\$key[0][\"cuenta\"] < 1) {\$this->error[] = ['tipo'=>'Validacion', 'Campo'=>'".$valor['columnaOri']."', 'Detalle' => 'Referencia no encontrada en ".$valor['tablaRef']."'];}\n";
            $dependencias .= "}";
        }

        $insertDatos = substr($insertDatos, 1);
        $insertColumn = substr($insertColumn, 1);
        $insertValue = substr($insertValue, 1);
        $insertExtraVal .= "\nif (count(\$this->error) > 0) {\$link->close(); return 1;}\n";

        return "private function insert()
                {
                    \$link = new ConexionSistema();
                    \$this->clearError();
                    $dependencias
                    $insertExtraVal
                    \$datos = [$insertDatos];
                    \$query = \"INSERT 
                                INTO $tabla 
                                    ($insertColumn) 
                             VALUES ($insertValue)\";
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
        $insertExtraVal = '';
        $i = -1;
        foreach ($datos as &$valor) {
            ++$i;
            if ($valor['Key'] == 'PRI') {
                $updateDatosPK .= ','.($i + 1000)." => ['tipo' => '".$valor['Type3']."', 'dato' => \$this->".$valor['Field']."]\n";
                if ($valor['Type'] == 'date'):
                    $updateWhere .= 'and '.$valor['Field']." = STR_TO_DATE(?, '%Y-%m-%d')\n";
                elseif ($valor['Type'] == 'datetime'):
                    $updateWhere .= 'and '.$valor['Field']." = STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s')\n";
                else:
                    $updateWhere .= 'and '.$valor['Field']." = ?\n";
                endif;
            } else {
                if ($valor['Null'] == 'NO') {
                    $insertExtraVal .= "\nif (is_null(\$this->".$valor['Field'].")) {
                        \$this->error[] = ['tipo'=>'Validacion', 'Campo'=>'".$valor['Field']."', 'Detalle' => 'No puede ser NULO'];
                    }";
                }

                $updateDatos .= ",$i => ['tipo' => '".$valor['Type3']."', 'dato' => \$this->".$valor['Field']."]\n";
                if ($valor['Type'] == 'date'):
                    $updateColumn .= ','.$valor['Field']." = STR_TO_DATE(?, '%Y-%m-%d')\n";
                elseif ($valor['Type'] == 'datetime'):
                    $updateColumn .= ','.$valor['Field']." = STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s')\n";
                else:
                    $updateColumn .= ','.$valor['Field']." = ?\n";
                endif;
            }
        }
        unset($valor);
        $referencias = self::referenciasTabla($tabla);
        $dependencias = '';
        foreach ($referencias as &$valor) {
            $dependencias .= "if (!is_null(\$this->".$valor['columnaOri'].")) {";
            $dependencias .= "\$key = \$link->consulta('select count(0) as cuenta from ".$valor['tablaRef'].' where '.$valor['columnaRef']." = \''.\$this->".$valor['columnaOri'].".'\'', []);\n";
            $dependencias .= "if (\$key[0][\"cuenta\"] < 1) {\$this->error[] = ['tipo'=>'Validacion', 'Campo'=>'".$valor['columnaOri']."', 'Detalle' => 'Referencia no encontrada en ".$valor['tablaRef']."'];}\n";
            $dependencias .= "}";
        }

        $updateDatos = substr($updateDatos, 1);
        if (strlen($updateDatos)==0) $updateDatosPK = substr($updateDatosPK, 1);
        $updateColumn = substr($updateColumn, 1);
        $insertExtraVal .= "\nif (count(\$this->error) > 0) {\$link->close(); return 1;}\n";

        return "private function update()
        {
            \$link = new ConexionSistema();
            $dependencias
            $insertExtraVal
            \$datos = [
                $updateDatos
                $updateDatosPK
            ];
            \$query = \"UPDATE $tabla 
                         SET $updateColumn
                       WHERE 1 = 1
                         $updateWhere\";
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
            \$this->clearArray();
            \$this->clearError();
            \$arrayUpdate = [$cadena];
            if (\$this->give(\$arrayUpdate) == 0) {
                if (count(\$this->getArray()) == 1) { \$this->setDatos(\$this->getArray()[0]); \$insert = false; }
            } else {
                return 1;
            }
            
            \$this->setDatos(\$array);
            if (\$insert) {
                return \$this->insert();
            } else {
                return \$this->update();
            }
        }\n";
    }

    private static function fncDelete(&$datos, &$tabla)
    {
        $dependencias = '';
        $deletePK = '';
        $i = -1;
        $escape = "if (count(\$this->error) > 0) {\$link->close(); return 1;}\n";
        $validacion = '';
        foreach ($datos as &$valor) {
            ++$i;
            if ($valor['Key'] == 'PRI') {
                $deletePK .= ",$i => ['tipo' => '".$valor['Type3']."', 'dato' => \$this->".$valor['Field']."]\n";
                if ($valor['Type'] == 'date'):
                    $deleteWhere .= 'and '.$valor['Field']." = STR_TO_DATE(?, '%Y-%m-%d')\n";
                elseif ($valor['Type'] == 'datetime'):
                    $deleteWhere .= 'and '.$valor['Field']." = STR_TO_DATE(?, '%Y-%m-%d %H:%i:%s')\n";
                else:
                    $deleteWhere .= 'and '.$valor['Field']." = ?\n";
                endif;
                $validacion .= 'if (is_null($this->'.$valor['Field'].")) { 
                    \$this->error[] = ['tipo'=>'Validacion', 'Campo'=>'".$valor['Field']."', 'Detalle' => 'No puede ser NULO'];
                } else {
                    \$datosPK['".$valor['Field']."'] = \$this->".$valor['Field'].';
                }';
            }
        }
        $deletePK = substr($deletePK, 1);

        unset($valor);
        $referencias = self::dependenciasTabla($tabla);
        $dependencias = '';
        foreach ($referencias as &$valor) {
            $dependencias .= "\$key = \$link->consulta('select count(0) as cuenta from ".$valor['tablaRef'].' where '.$valor['columnaRef']." = \''.\$this->".$valor['columnaOri'].".'\'', []);\n";
            $dependencias .= "if (\$key[0][\"cuenta\"] > 0) {\$this->error[] = ['tipo'=>'Validacion', 'Campo'=>'".$valor['columnaOri']."', 'Detalle' => 'Dependencia encontrada en ".$valor['tablaRef']."'];}\n";
        }

        return "public function delete(\$array)
        {
            \$link = new ConexionSistema();
            \$this->emptyClass();
            \$this->clearError();
            \$this->clearArray();
            \$this->setDatos(\$array);
            \$datosPK = [];
            $validacion
            $escape
            \$this->emptyClass();
            \$this->clearError();
            \$this->clearArray();
            if (\$this->give(\$datosPK) != 0) return 1;
            \$this->setDatos(\$this->getArray()[0]);
            $dependencias
            $escape
            \$datos = [
                $deletePK
            ];
            \$query = 'delete from $tabla 
                       WHERE 1 = 1
                         $deleteWhere';
            \$link->ejecuta(\$query, \$datos);
            \$this->error = \$link->getListaErrores();
            \$satus = (\$link->hayError()) ? 1 : 0;
            \$this->array = \$this->getDatos();
            \$link->close();
            \$this->clearArray();
            unset (\$link);

            return \$satus;
        }\n
        ";
    }

    private static function dependenciasTabla(&$tabla)
    { //busco si alguien está usando el dato maestro que quiero borrar
        $link = new ConexionSistema();
        $esquema = $link->getApplication();
        $datos = $link->consulta("select TABLE_NAME as tablaRef, 
                                         COLUMN_NAME as columnaRef,
                                         REFERENCED_COLUMN_NAME as columnaOri
                                    from information_schema.key_column_usage
                                   where REFERENCED_table_name = '$tabla'
                                     and table_schema = '$esquema'
                                     and referenced_table_name <> ''", []);
        if ($link->hayError()) {
            die(json_encode($link->getListaErrores()));
        }
        $link->close();
        unset($link);

        return $datos;
    }

    private static function referenciasTabla(&$tabla)
    { //busco si existe el dato maestro que intento guardar
        $link = new ConexionSistema();
        $esquema = $link->getApplication();
        $datos = $link->consulta("select REFERENCED_TABLE_NAME as tablaRef, 
                                         REFERENCED_COLUMN_NAME as columnaRef,
                                         COLUMN_NAME as columnaOri
                                    from information_schema.key_column_usage
                                   where table_name = '$tabla'
                                     and table_schema = '$esquema'
                                     and referenced_table_name <> ''", []);
        if ($link->hayError()) {
            die(json_encode($link->getListaErrores()));
        }
        $link->close();
        unset($link);

        return $datos;
    }

    private static function datosTabla(&$tabla)
    {
        $link = new ConexionSistema();
        $apli = $link->getApplication();
        $valid = $link->consulta("select table_name 
                                    from information_schema.tables
                                   where table_schema = '$apli' 
                                     and table_name = '$tabla'", []);
        if (count($valid) < 1) {
            die(json_encode(['success' => false, 'root' => "La tabla '$tabla' no se encuentra en la aplicación '$apli'"]));
        }
        $datos = $link->consulta("desc $tabla", []);

        if ($link->hayError()) {
            die(json_encode($link->getListaErrores()));
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
            if ($datos[$i]['Type2'] == 'int' || $datos[$i]['Type2'] == 'tinyint') {
                $datos[$i]['Type3'] = 'i';
                $datos[$i]['Type2'] = 'int';
            }
            if ($datos[$i]['Type2'] == 'varchar' || $datos[$i]['Type'] == 'date' || $datos[$i]['Type'] == 'datetime') {
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
            $cadena .= self::fncDelete($array, $tabla);
            $cadena .= self::fncConstruct();
            $cadena .= "}\n";
            //echo var_dump($cadena, true);
            eval($cadena);
        }

        return new $clsName();
    }
}

?>

