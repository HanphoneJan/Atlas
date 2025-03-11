<?php
// 配置文件，存储应用程序的密钥和其他敏感信息

// 设置token密钥
define('SECRET_KEY', 'xxxxxx'); 
//内部存储图片的路径
define('INTERNAL_PATH', '/www/server_atlas/atlas/'); 
//外部访问图片的路径
define('EXTERN_PATH', 'https://xxxx.top/xxxx/xxxx'); 
//JWT配置，用于生成token
define('JWT_ISSUER', 'xxxxxx'); 
define('JWT_AUDIENCE', 'xxxx'); 
?>
