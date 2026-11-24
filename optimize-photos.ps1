# Makes small, fast-loading copies of everything in the "photos" folder.
# Run it again whenever you add new photos (it skips ones already done):
#     powershell -ExecutionPolicy Bypass -File .\optimize-photos.ps1
#
# Output:  photos-web\1200\...  (gallery)   photos-web\2400\...  (slideshow + full-screen view)
# Your original files are never changed.

param([int[]]$Sizes = @(1200, 2400), [int]$Quality = 82)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = $PSScriptRoot
$src  = Join-Path $root 'photos'
$out  = Join-Path $root 'photos-web'

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)
$attr = New-Object System.Drawing.Imaging.ImageAttributes
$attr.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)

$files = Get-ChildItem $src -Recurse -File | Where-Object { $_.Extension -match '^\.(jpe?g|png)$' }
$made = 0; $skipped = 0

foreach ($f in $files) {
  $rel = $f.FullName.Substring($src.Length + 1)
  $targets = foreach ($s in $Sizes) {
    [pscustomobject]@{ Size = $s; Path = [IO.Path]::ChangeExtension((Join-Path (Join-Path $out $s) $rel), '.jpg') }
  }
  $stale = $targets | Where-Object { -not (Test-Path $_.Path) -or (Get-Item $_.Path).LastWriteTime -lt $f.LastWriteTime }
  if (-not $stale) { $skipped++; continue }

  $img = [System.Drawing.Image]::FromFile($f.FullName)
  try {
    # Turn the picture the right way up (cameras store rotation separately)
    if ($img.PropertyIdList -contains 0x0112) {
      switch ($img.GetPropertyItem(0x0112).Value[0]) {
        3 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
        6 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
        8 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
      }
    }
    foreach ($t in $targets) {
      $scale = [Math]::Min([double]1, [double]$t.Size / [Math]::Max($img.Width, $img.Height))
      $w = [int][Math]::Round($img.Width * $scale)
      $h = [int][Math]::Round($img.Height * $scale)
      $bmp = New-Object System.Drawing.Bitmap $w, $h
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
      $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $w, $h), 0, 0, $img.Width, $img.Height, [System.Drawing.GraphicsUnit]::Pixel, $attr)
      New-Item -ItemType Directory -Force (Split-Path $t.Path) | Out-Null
      $bmp.Save($t.Path, $codec, $params)   # saved without camera data (GPS etc.)
      $g.Dispose(); $bmp.Dispose()
    }
    $made++
    Write-Host "done  $rel"
  } finally { $img.Dispose() }
}

$total = (Get-ChildItem $out -Recurse -File -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum
Write-Host ("`n{0} photos processed, {1} already up to date. Web copies total {2:N1} MB." -f $made, $skipped, ($total / 1MB))
