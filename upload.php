<?php
// Prosty upload zdjęć + dodawanie aktualności
if (!file_exists('uploads')) mkdir('uploads');
if (!file_exists('uploads/galeria')) mkdir('uploads/galeria', 0777, true);
if (!file_exists('data')) mkdir('data');

$mode = $_POST['mode'] ?? '';

if ($mode === 'photo' && isset($_FILES['photo'])) {
    $target = 'uploads/galeria/' . basename($_FILES['photo']['name']);
    if (move_uploaded_file($_FILES['photo']['tmp_name'], $target)) echo "OK"; else echo "ERR";
    exit;
}

if ($mode === 'news') {
    $title = $_POST['title'] ?? '';
    $content = $_POST['content'] ?? '';
    $file = "data/aktualnosci.json";
    $arr = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
    $arr[] = ["title"=>$title, "content"=>$content, "date"=>date("Y-m-d")];
    file_put_contents($file, json_encode($arr, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
    echo "OK";
    exit;
}

echo "Invalid mode";
?>