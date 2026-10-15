# design/ogp/og.html を、public/og.png(1200×630)にする。
# Edge のヘッドレス表示でスクリーンショットを撮る。実行: powershell -File design/ogp/render.ps1
$ErrorActionPreference = 'Stop'

$root = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$html = Join-Path $PSScriptRoot 'og.html'
$out = Join-Path $root 'public\og.png'

$edge = @(
  "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $edge) { throw 'Edge か Chrome が見つかりません' }

$url = ([System.Uri](Resolve-Path $html).Path).AbsoluteUri

& $edge --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 `
  --window-size=1200,630 --allow-file-access-from-files --virtual-time-budget=8000 `
  "--screenshot=$out" $url | Out-Null

if (-not (Test-Path $out)) { throw 'og.png を作れませんでした' }
"{0}  {1:N0} bytes" -f $out, (Get-Item $out).Length
