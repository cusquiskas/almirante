<?php 
    $manejador = ControladorDinamicoTabla::set('ADM_SESION');

    class ctrlSesion extends Tabla_ADM_SESION
    {
        public function login ($token) {
            $link = new ConexionSistema();
            $login = $link->consulta("select usr_id 
                                        from ADM_USUARIO
                                    where usr_id+usr_passw = '$token'", []);
            
        }
        
    }
    
?>