<?php

class Cache
{
    public function ruta($url)
    {
        require_once 'conex/conf.php';  //información crítica del sistema
        $timestamp = '';
        $conf = new ConfiguracionSistema();
        $pa = $conf->getHome().$url;
        unset($conf);
        $pa .= "$url";
        //die $pa;
        if (file_exists($pa)) {
            $timestamp = filectime($pa);
        }

        return "$url?$timestamp";
    }
}

class Fecha
{
    public static function formatea($fecha, $output)
    {
        $dt = new DateTime($fecha);

        return $dt->format($output);
    }
}
