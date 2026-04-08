Copy-Item "tz_garage.docx" "tz_garage.zip"
Expand-Archive -Path "tz_garage.zip" -DestinationPath "temp_docx"
$xml = [xml](Get-Content "temp_docx\word\document.xml")
$ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
$ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
$text = ($xml.SelectNodes("//w:t", $ns) | ForEach-Object { $_.InnerText }) -join " "
Write-Host $text