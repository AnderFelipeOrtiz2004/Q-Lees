<?php

return [

    /*
    | Define qué rutas estarán sujetas a CORS. 
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    /*
    | Métodos HTTP permitidos. '*' para permitir todos.
    */

    'allowed_methods' => ['*'],

    /*
    | IMPORTANTE: Especifica el origen de tu Angular.
    | Esto evita problemas de seguridad y conflictos con credenciales.
    */

    'allowed_origins' => ['http://localhost:4200'], 

    'allowed_origins_patterns' => [],

    /*
    | Headers permitidos. Mantén '*' para no tener problemas con 
    | headers personalizados (como Authorization o Content-Type).
    */

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    /*
    | Si vas a usar Login, Registro o Sanctum, esto DEBE estar en true.
    | Permite que Angular envíe cookies o tokens de sesión.
    */

    'supports_credentials' => true,

];