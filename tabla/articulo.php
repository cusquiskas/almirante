<?php

    class Articulo
    {
        private $art_codart; // INT NOT NULL AUTO_INCREMENT
        private $art_nombre; // VARCHAR(200) NOT NULL
        private $art_codfam; // INT NOT NULL

        private $array;

        private function clearArray()
        {
            $this->$array = $this->empty;

            return 0;
        }

        public function getArray()
        {
            return $this->array;
        }

        private $empty;

        private function emptyClass()
        {
            $this->setDatos($this->empty);

            return 0;
        }

        private $error;

        public function getListaErrores()
        {
            return $this->error;
        }

        private function setDatos($array)
        {
            $this->art_codart = (isset($array['art_codart']) ? (int) $array['art_codart'] : null);
            $this->art_nombre = (isset($array['art_nombre']) ? (string) $array['art_nombre'] : null);
            $this->art_codfam = (isset($array['art_codfam']) ? (int) $array['art_codfam'] : null);

            return 0;
        }

        private function getDatos()
        {
            return [
                'art_codart' => $this->art_codart,
                'art_nombre' => $this->art_nombre,
                'art_codfam' => $this->art_codfam,
            ];
        }

        private function insert()
        {
            $datos = [
                0 => ['tipo' => 's', 'dato' => $this->art_nombre],
                1 => ['tipo' => 'i', 'dato' => $this->art_codfam],
            ];
            $query = 'INSERT 
                        INTO ARTICULO 
                             (art_nombre,
                              art_codfam) 
                      VALUES (?,         
                              ?)';
            $link = new ConexionSistema();
            $link->ejecuta($query, $datos);
            $link->close();
            $this->array = $this->getDatos();
            $this->error = $link->getListaErrores();

            return ($link->hayError()) ? 1 : 0;
        }

        private function update()
        {
            $datos = [
                0 => ['tipo' => 's', 'dato' => $this->art_nombre],
                1 => ['tipo' => 'i', 'dato' => $this->art_codfam],
                2 => ['tipo' => 'i', 'dato' => $this->art_codart],
            ];
            $query = 'UPDATE CLIENTE 
                         SET art_nombre = ?,
                             art_codfam = ?
                       WHERE art_codart = ?';
            $link = new ConexionSistema();
            $link->ejecuta($query, $datos);
            $link->close();
            $this->array = $this->getDatos();
            $this->error = $link->getListaErrores();

            return ($link->hayError()) ? 1 : 0;
        }

        private function select()
        {
            $datos = [
                0 => ['tipo' => 's', 'dato' => $this->art_nombre],
                1 => ['tipo' => 'i', 'dato' => $this->art_codfam],
                2 => ['tipo' => 'i', 'dato' => $this->art_codart],
            ];
            $query = 'select *
                        from ARTICULO
                       where art_nombre = IFNULL(?, art_nombre)
                         and art_codfam = IFNULL(?, art_codfam)
                         and art_codart = IFNULL(?, art_codart)';
            $link = new ConexionSistema();
            $this->array = $link->consulta($query, $datos);
            $link->close();
            $this->error = $link->getListaErrores();

            return ($link->hayError()) ? 1 : 0;
        }

        public function save($array)
        {
            $this->emptyClass();
            $this->setDatos($array);
            if ($this->cli_codcli > 0) {
                return $this->update();
            } else {
                return $this->insert();
            }
        }

        public function give($array)
        {
            $this->emptyClass();
            //$this->clearArray();
            $this->setDatos($array);

            return $this->select();
        }

        public function __construct()
        {
            $this->empty = $this->getDatos();

            return 0;
        }
    }
