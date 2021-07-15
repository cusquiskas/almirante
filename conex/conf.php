<?php

class ConfiguracionSistema
{
    private $host = 'localhost';
    private $user = 'super';
    private $pass = 'còmprame';
    private $apli = 'super';

    private $home = '/opt/lampp/htdocs/supermercado/';

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
