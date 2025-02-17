<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

        
    Class SMTP_Mailer
    {
        
        private $mail   = null;
        public  $error  = null;
        public  $asunto = null;
        public  $cuerpo = null;
        
        public function __construct()
        {
            //Import PHPMailer classes into the global namespace
            //These must be at the top of your script, not inside a function
            require 'PHPMailer/src/Exception.php';
            require 'PHPMailer/src/PHPMailer.php';
            require 'PHPMailer/src/SMTP.php';
            //Create an instance; passing `true` enables exceptions
            $this->mail = new PHPMailer(true);
            //Server settings
            $this->mail->Host       = 'smtp.hostinger.com';                     //Set the SMTP server to send through
            $this->mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
            $this->mail->Username   = 'noreply@cusquiskas.com';                     //SMTP username
            
            $this->mail->SMTPAuth   = true;                                   //Enable SMTP authentication
            $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
            $this->mail->CharSet    = PHPMailer::CHARSET_UTF8;
            $this->mail->isSMTP();                                            //Send using SMTP
            $this->mail->setLanguage('es');
            $this->mail->setFrom('noreply@cusquiskas.com', 'Noreply');
            $this->mail->isHTML(true);                                  //Set email format to HTML
        }
        public function destinatario($correo, $nombre) {
            $this->mail->addAddress($correo, $nombre);
        }

        public function esHTML($bol) {
            $this->mail->isHTML($bol);                                  //Set email format to HTML
        }

        public function verbose() {
            $this->mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
        }

        public function destinatarioCC($correo, $nombre) {
            $this->mail->addCC($correo, $nombre);
        }

        public function destinaratioCO($correo, $nombre) {
            $this->mail->addBCC($correo, $nombre);
        }

        public function adjunto ($origen, $nombre) {
            $this->mail->addAttachment($origen, $nombre);
        }

        public function mandaMail($asunto = '', $cuerpo = '') {
            try {
                if (isset($asunto) && $asunto != "") $this->asunto = $asunto;
                if (isset($cuerpo) && $cuerpo != "") $this->cuerpo = $cuerpo;
                //Content
                $this->mail->Subject = $this->asunto;
                $this->mail->Body    = $this->cuerpo;
                #$mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
    
                $this->mail->send();
                return true;
            } catch (Exception $e) {
                $this->error = $this->mail->ErrorInfo;
                return false;
            }
        }
        public function __destruct() {
            unset($this->mail);
        }
    }


    $correo = new SMTP_Mailer();
    $correo->destinatario('cusquiskas@gmail.com', 'José Miguel');
    $correo->asunto = 'Pruebas final PHPMailer';
    $correo->cuerpo = '<h1>SUCCESS</h1><hr/><p>El contenido del correo, ahora le estoy diciendo que lo que mando <b>es HTML</b></p><p>Ahora me paso a la librería PHPMailer, que va como un cañón.</p>';
    #$nuevo->verbose();
    if ($correo->mandaMail()) {
        echo "Correo enviado";
    } else {
        echo "Error: ". var_export($nuevo->error, true);
    }

?>