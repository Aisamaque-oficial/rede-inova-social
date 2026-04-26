$p1 = Get-Content -Path src/lib/mock-data.ts -TotalCount 432
$p2 = Get-Content -Path part2.ts.tmp
$p3 = Get-Content -Path src/lib/mock-data.ts | Select-Object -Skip 774
$all = $p1 + $p2 + $p3
Set-Content -Path src/lib/mock-data.ts -Value $all -Encoding UTF8
