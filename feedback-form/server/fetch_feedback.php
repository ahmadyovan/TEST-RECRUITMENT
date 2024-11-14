<?php
header("Content-Type: application/json");

$conn = new mysqli('localhost', 'root', '', 'mydb');
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$result = $conn->query("SELECT name, message FROM feedback");
$feedback = [];
while ($row = $result->fetch_assoc()) {
    $feedback[] = $row;
}

echo json_encode(["status" => "success", "data" => $feedback]);
$conn->close();
?>
