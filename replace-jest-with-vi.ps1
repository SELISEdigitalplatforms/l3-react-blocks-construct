# PowerShell script to replace Jest with Vitest in all test files

# Find all .spec.ts and .spec.tsx files
$testFiles = Get-ChildItem -Path "src" -Recurse -Include "*.spec.ts", "*.spec.tsx"

Write-Host "Found $($testFiles.Count) test files to update"

foreach ($file in $testFiles) {
    Write-Host "Processing: $($file.FullName)"
    
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # Replace jest with vi imports and functions
    $content = $content -replace 'jest\.mock', 'vi.mock'
    $content = $content -replace 'jest\.fn', 'vi.fn'
    $content = $content -replace 'jest\.spyOn', 'vi.spyOn'
    $content = $content -replace 'jest\.requireActual', 'vi.importActual'
    $content = $content -replace 'jest\.requireMock', 'vi.importMock'
    $content = $content -replace 'jest\.clearAllMocks', 'vi.clearAllMocks'
    $content = $content -replace 'jest\.restoreAllMocks', 'vi.restoreAllMocks'
    $content = $content -replace 'jest\.useFakeTimers', 'vi.useFakeTimers'
    $content = $content -replace 'jest\.useRealTimers', 'vi.useRealTimers'
    $content = $content -replace 'jest\.runOnlyPendingTimers', 'vi.runOnlyPendingTimers'
    
    # Add vi import if jest functions were replaced and vi import doesn't exist
    if ($content -ne $originalContent -and $content -notmatch 'import.*vi.*from.*vitest') {
        # Check if there are any imports at the top
        if ($content -match '(import\s+.*from\s+.*;\s*\n)') {
            $content = $content -replace '(import\s+.*from\s+.*;\s*\n)', "`$1import { vi } from 'vitest'`n"
        } else {
            $content = "import { vi } from 'vitest'`n" + $content
        }
    }
    
    # Only write if content changed
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  Updated successfully"
    } else {
        Write-Host "  No changes needed"
    }
}

Write-Host "Replacement complete!"
