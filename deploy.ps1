$env:MIDNIGHT_NETWORK="preview"
Get-Content .env.preview | ForEach-Object {
    if ($_ -match '^(.*?)=(.*)$') {
        Set-Item -Path "Env:\$($matches[1])" -Value $matches[2].Trim('"')
    }
}
yarn deploy:preview
