$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$mvn = Get-Command mvn -ErrorAction SilentlyContinue
$fallbacks = @(
    "C:\tmp\apache-maven-3.9.16\bin\mvn.cmd",
    "C:\tmp\apache-maven-3.9.9\bin\mvn.cmd"
)

if ($mvn) {
    $mvnCmd = $mvn.Source
} else {
    $mvnCmd = $fallbacks | Where-Object { Test-Path $_ } | Select-Object -First 1
    if (-not $mvnCmd) {
        Write-Error "Maven not found. Install Maven or place it under C:\tmp\apache-maven-3.9.x\bin\mvn.cmd"
        exit 1
    }
}

Push-Location $scriptDir
try {
    & $mvnCmd spring-boot:run
    exit $LASTEXITCODE
}
finally {
    Pop-Location
}
