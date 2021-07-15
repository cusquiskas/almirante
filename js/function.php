<?php

 require_once 'conex/conf.php';  //información crítica del sistema
class Cache
{
    public function ruta($url)
    {
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
