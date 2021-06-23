<?php

class Tabla_IVA
{
    private $iva_codiva;
    private $iva_nombre;
    private $iva_valor;
    private $iva_desde;
    private $iva_hasta;
    private $empty;
    private $array;
    private $error;

    private function getDatos()
    {
        return ['iva_codiva' => $this->iva_codiva, 'iva_nombre' => $this->iva_nombre, 'iva_valor' => $this->iva_valor, 'iva_desde' => $this->iva_desde, 'iva_hasta' => $this->iva_hasta,
     ];
    }

    private function setDatos($array)
    {
        $this->iva_codiva = (isset($array['iva_codiva']) ? (int) $array['iva_codiva'] : $this->iva_codiva);
        $this->iva_nombre = (isset($array['iva_nombre']) ? (string) $array['iva_nombre'] : $this->iva_nombre);
        $this->iva_valor = (isset($array['iva_valor']) ? (int) $array['iva_valor'] : $this->iva_valor);
        $this->iva_desde = (isset($array['iva_desde']) ? (string) $array['iva_desde'] : $this->iva_desde);
        $this->iva_hasta = (isset($array['iva_hasta']) ? (string) $array['iva_hasta'] : $this->iva_hasta);

        return 0;
    }

    private function select()
    {
        $datos = [0 => ['tipo' => 'i', 'dato' => $this->iva_codiva], 1 => ['tipo' => 's', 'dato' => $this->iva_nombre], 2 => ['tipo' => 'i', 'dato' => $this->iva_valor], 3 => ['tipo' => '', 'dato' => $this->iva_desde], 4 => ['tipo' => '', 'dato' => $this->iva_hasta],
     ];
        $query = 'select * from IVA where 1 = 1  and IFNULL(iva_codiva, \'!\') = IFNULL(?, IFNULL(iva_codiva, \'!\'))
     and IFNULL(iva_nombre, \'!\') = IFNULL(?, IFNULL(iva_nombre, \'!\'))
     and IFNULL(iva_valor, \'!\') = IFNULL(?, IFNULL(iva_valor, \'!\'))
     and IFNULL(iva_desde, \'!\') = IFNULL(?, IFNULL(iva_desde, \'!\'))
     and IFNULL(iva_hasta, \'!\') = IFNULL(?, IFNULL(iva_hasta, \'!\'))
    ';
        $link = new ConexionSistema();
        $this->array = $link->consulta($query, $datos);
        $this->error = $link->getListaErrores();
        $status = ($link->hayError()) ? 1 : 0;
        $link->close();

        return $status;
    }

    private function emptyClass()
    {
        $this->setDatos($this->empty);

        return 0;
    }

    private function clearArray()
    {
        $this->array = $this->empty;

        return 0;
    }

    public function getArray()
    {
        return $this->array;
    }

    public function getListaErrores()
    {
        return $this->error;
    }

    public function give($array)
    {
        $this->emptyClass();
        $this->clearArray();
        $this->setDatos($array);

        return $this->select();
    }

    public function __construct()
    {
        $this->empty = $this->getDatos();

        return 0;
    }
}
