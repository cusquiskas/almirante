<?php
    session_start();
    error_reporting(E_ALL & ~E_NOTICE);

    require_once 'conex/conf.php';  //información crítica del sistema
    require_once 'conex/dao.php';   //control de comunicación con la base de datos MySQL

    //header('Content-Type: application/json; charset=utf-8');

    class ControladorDinamicoTabla
    {
        public static function set($clsName, $array = [])
        {
            if (!class_exists($clsName)) {
                $cadena = "class $clsName { \n";
                $getDatos = 'private function getDatos(){return [';
                foreach ($array as &$valor) {
                    $cadena .= 'private $'.$valor['Field'].";\n";
                    $cadena .= 'public function get'.$valor['Field'].' () { return $this->'.$valor['Field']."; } \n";
                    $cadena .= 'public function set'.$valor['Field'].' ($valor) { return $this->'.$valor['Field']." = \$valor; } \n";
                }
                $getDatos .= "];}\n";
                unset($valor);
                $cadena .= "private \$empty;  \n";
                $cadena .= "private \$array;  \n";
                $cadena .= "public function get () { return \$this->host; } \n";
                $cadena .= "public function __construct() { \$this->empty = \$this->getDatos(); }\n";
                $cadena .= $getDatos;
                $cadena .= "} \n";
                //echo var_dump($cadena, true);
                eval($cadena);
            }

            return new $clsName();
        }
    }

    //echo '{"success":true}';

    $tablaObjeto = 'ARTICULO';
    $link = new ConexionSistema();
    $datos = $link->consulta("desc $tablaObjeto", []);
    $link->close();
    $manejador = ControladorDinamicoTabla::set("Tabla_$tablaObjeto", $datos);
    //$manejador->setart_codart(1);
    echo var_dump($manejador, true);
    //echo '<ln>';
    //echo json_encode($datos);

    unset($manejador);
    unset($link);

?>

