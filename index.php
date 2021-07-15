<?php
    session_start();
    require_once 'js/function.php';
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Arquetipo para nuevos proyectos</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon"       href="css/img/imagen.gif" type="image/png" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" media="screen" href="<?php echo Cache::ruta('css/style.css'); ?>">
</head>
<body>
    <template id="header"></template>
    <template id="body"></template>
    <template id="footer"></template>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js"></script>
    <script src="js/jquery-3.3.1.min.js"></script>
    <script>let session = "<?php echo session_id(); ?>";</script>
    <script src="<?php echo Cache::ruta('js/funciones.js'); ?>"></script>
    <script src="<?php echo Cache::ruta('js/peticionAjax.js'); ?>"></script>
    <script src="<?php echo Cache::ruta('js/controller.js'); ?>"></script>
    <script src="<?php echo Cache::ruta('js/scripts.js'); ?>"></script>
</body>
</html>