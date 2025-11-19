<?php
$recipient = "mobilshot@wp.pl";
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$message = $_POST['message'] ?? '';
if (!$name || !$email || !$message) { http_response_code(400); echo "Brak wymaganych pól!"; exit; }
$subject = "Nowe zgłoszenie ze strony MobilShot";
$body = "Imię i nazwisko: $name\nEmail: $email\nTelefon: $phone\n\nWiadomość:\n$message";
$headers = "From: $email\r\nReply-To: $email\r\n";
if (mail($recipient, $subject, $body, $headers)) echo "OK"; else { http_response_code(500); echo "Błąd wysyłania wiadomości!"; }
?>