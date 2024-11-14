<?php
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$conn = new mysqli('localhost', 'root', '', 'mydb');

if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO feedback (name, email, message) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $data['name'], $data['email'], $data['message']);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    echo json_encode(["status" => "success", "message" => "Feedback saved!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to save feedback."]);
}

$stmt->close();
$conn->close();
?>
