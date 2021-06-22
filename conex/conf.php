<?php

class ConfiguracionSistema
{
    private $host = 'localhost';
    private $user = 'cuidador';
    private $pass = 'MultiPiensos';
    private $apli = 'animales';

    private $home = '/opt/lampp/htdocs/almirante/';

    public function getHost()
    {
        return $this->host;
    }

    public function getUser()
    {
        return $this->user;
    }

    public function getPass()
    {
        return $this->pass;
    }

    public function getApli()
    {
        return $this->apli;
    }

    public function getHome()
    {
        return $this->home;
    }
}
