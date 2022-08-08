# Prevent push to `main` branch

Move pre-push script to `.git/hooks`. The script runs before every push and is run locally. If you want to force push to main either just rename the `.git/hooks/pre-push` to something else or run `git push --no-verify`.
