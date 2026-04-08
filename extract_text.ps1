$word = New-Object -ComObject Word.Application
$doc = $word.Documents.Open("c:\Users\Ramzan\OneDrive\Desktop\гараж\tz_garage.docx")
$text = $doc.Content.Text
Write-Host $text
$doc.Close()
$word.Quit()