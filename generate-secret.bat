@echo off
REM generate-secret.bat - Generate NextAuth secret for Windows

echo Generating NextAuth secret...
echo.

REM Use PowerShell to generate random bytes and convert to base64
for /f "delims=" %%i in ('powershell -command "[System.Convert]::ToBase64String((1..32 | ForEach {Get-Random -Maximum 256}))"') do set SECRET=%%i

echo Your NextAuth secret:
echo NEXTAUTH_SECRET=%SECRET%
echo.
echo Add this to your .env.local file
echo.

echo Alternative method (Node.js):
echo node -e "console.log('NEXTAUTH_SECRET=' + require('crypto').randomBytes(32).toString('base64'))"

pause