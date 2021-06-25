<?php

class Tabla_ARTICULO
{
    private $art_codart;
    private $art_nombre;
    private $art_codfam;
    private $empty;
    private $array;
    private $error;

    private function getDatos()
    {
        return ['art_codart' => $this->art_codart, 'art_nombre' => $this->art_nombre, 'art_codfam' => $this->art_codfam,
     ];
    }

    private function setDatos($array)
    {
        $this->art_codart = (isset($array['art_codart']) ? (int) $array['art_codart'] : $this->art_codart);
        $this->art_nombre = (isset($array['art_nombre']) ? (string) $array['art_nombre'] : $this->art_nombre);
        $this->art_codfam = (isset($array['art_codfam']) ? (int) $array['art_codfam'] : $this->art_codfam);

        return 0;
    }

    private function select()
    {
        $datos = [0 => ['tipo' => 'i', 'dato' => $this->art_codart], 1 => ['tipo' => 's', 'dato' => $this->art_nombre], 2 => ['tipo' => 'i', 'dato' => $this->art_codfam],
     ];
        $query = 'select * from ARTICULO where 1 = 1  and IFNULL(art_codart, \'!\') = IFNULL(?, IFNULL(art_codart, \'!\'))
     and IFNULL(art_nombre, \'!\') = IFNULL(?, IFNULL(art_nombre, \'!\'))
     and IFNULL(art_codfam, \'!\') = IFNULL(?, IFNULL(art_codfam, \'!\'))
    ';
        $link = new ConexionSistema();
        $this->array = $link->consulta($query, $datos);
        $this->error = $link->getListaErrores();
        $status = ($link->hayError()) ? 1 : 0;
        $link->close();
        unset($link);

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

    private function insert()
    {
        if (is_null($this->art_nombre)) {
            array_push($this->error, ['tipo' => 'Validacion', 'Campo' => 'art_nombre', 'Detalle' => 'No puede ser NULO']);
        }
        if (is_null($this->art_codfam)) {
            array_push($this->error, ['tipo' => 'Validacion', 'Campo' => 'art_codfam', 'Detalle' => 'No puede ser NULO']);
        }
        if (!is_null($this->error)) {
            return 1;
        }

        $datos = [1 => ['tipo' => 's', 'dato' => $this->art_nombre], 2 => ['tipo' => 'i', 'dato' => $this->art_codfam],
    ];
        $query = 'INSERT 
                                    INTO ARTICULO 
                                        (art_nombre,art_codfam) 
                                 VALUES (?
    ,?
    )';
        $link = new ConexionSistema();
        $link->ejecuta($query, $datos);
        $this->error = $link->getListaErrores();
        $satus = ($link->hayError()) ? 1 : 0;
        if ($status == 0) {
            $key = $link->consulta('select last_insert_id() id', []);
            $this->art_codart = ['id'];
        }

        $this->array = $this->getDatos();
        $link->close();
        unset($link);

        return $satus;
    }
}
