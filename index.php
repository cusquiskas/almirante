<?php
    session_start();
    error_reporting(E_ALL & ~E_NOTICE);

    require_once 'conex/conf.php';  //información crítica del sistema
    require_once 'conex/dao.php';   //control de comunicación con la base de datos MySQL

    require_once 'tabla/controller.php';   //genera la clase de una tabla dinámicamente bajo petición

    header('Content-Type: application/json; charset=utf-8');

    $manejador = ControladorDinamicoTabla::set('ARTICULO');
    if ($manejador->give([]) != 0) {
        die(json_encode($manejador->getListaErrores()));
    }

    $listaArticulo = $manejador->getArray();

    $manejador = ControladorDinamicoTabla::set('ESPECIFICACION');
    $manFamilia = ControladorDinamicoTabla::set('FAMILIA');
    $manIVA = ControladorDinamicoTabla::set('IVA');
    $i = -1;
    foreach ($listaArticulo as $valor) {
        ++$i;
        if ($manejador->give(['esp_codart' => $valor['art_codart']]) != 0) {
            die(json_encode($manejador->getListaErrores()));
        } else {
            $listaArticulo[$i]['especificacion'] = $manejador->getArray();
        }
        if ($manFamilia->give(['fam_codfam' => $valor['art_codfam']]) != 0) {
            die(json_encode($manFamilia->getListaErrores()));
        } else {
            $listaArticulo[$i]['familia'] = $manFamilia->getArray();
            if ($manIVA->give(['iva_codiva' => $listaArticulo[$i]['familia'][0]['fam_codiva']]) != 0) {
                die(json_encode($manFamilia->getListaErrores()));
            } else {
                $listaArticulo[$i]['familia'][0]['IVA'] = $manFamilia->getArray();
            }
        }
    }

    echo json_encode($listaArticulo);

    unset($manejador);
    unset($manFamilia);
    unset($manIVA);
    unset($link);

?>

