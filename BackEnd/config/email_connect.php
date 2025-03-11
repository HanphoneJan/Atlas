<?php
/**
 * 获取 SMTP 配置信息
 *
 * 此函数返回一个包含 SMTP 服务器配置的数组，包括服务器地址、端口、用户名、密码、发件人邮箱和发件人名称。
 *
 * @return array 返回 SMTP 配置信息数组
 */
function getSmtpConfig() {
    return array(
        'server' => 'smtp.163.com', // SMTP 服务器地址
        'port' => 587, // SMTP 端口
        'username' => 'xxxx@163.com', // SMTP 用户名
        'password' => 'xxxxx', // SMTP 密码（授权码）
        'from_email' => 'xxxx@163.com', // 发件人邮箱地址
        'from_name' => '寒枫' // 发件人名称
    );
}
?>
