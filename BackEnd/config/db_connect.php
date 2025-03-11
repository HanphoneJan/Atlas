<?php
// 该文件用于连接数据库
/**
 * 获取数据库连接
 *
 * 此函数用于创建并返回与MySQL数据库的连接。
 * 如果连接失败，将抛出异常以便进行错误处理。
 *
 * @throws Exception 如果数据库连接失败
 * @return mysqli 返回数据库连接对象
 */
function getDbConnection() {
    $servername = "localhost";  // 服务器地址
    $username = "xxxx";  // 数据库用户名
    $password = "xxxx";  // 数据库密码
    $database = "atlas"; // 数据库名

    // 创建连接，mysqli是PHP连接MySQL的扩展
    $conn = new mysqli($servername, $username, $password, $database);

    // 检查连接
    if ($conn->connect_error) {
        // 使用抛出异常而非直接die，便于错误处理
        throw new Exception("数据库连接失败: " . $conn->connect_error);
    }

    return $conn;
}
?>
