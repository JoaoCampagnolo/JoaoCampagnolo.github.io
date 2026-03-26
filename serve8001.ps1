$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://localhost:8001/')
$listener.Start()
Write-Host "Listening on http://localhost:8001"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.LocalPath
    if ($path -eq '/') { $path = '/index.html' }
    $file = Join-Path $root $path.Replace('/', '\')
    if (Test-Path $file) {
        $bytes = [IO.File]::ReadAllBytes($file)
        $ext = [IO.Path]::GetExtension($file)
        $mime = @{'.html'='text/html';'.css'='text/css';'.js'='application/javascript';'.png'='image/png';'.jpg'='image/jpeg';'.jpeg'='image/jpeg';'.pdf'='application/pdf'}[$ext]
        if (-not $mime) { $mime = 'application/octet-stream' }
        $ctx.Response.ContentType = $mime
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $ctx.Response.StatusCode = 404
    }
    $ctx.Response.Close()
}
