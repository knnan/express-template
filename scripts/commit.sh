#!/bin/sh

# This script is used to write a conventional commit message.
# It prompts the user to choose the type of commit as specified in the
# conventional commit spec. And then prompts for the summary and detailed
# description of the message and uses the values provided. as the summary and
# details of the message.
#
# If you want to add a simpler version of this script to your dotfiles, use:
#
# alias gcm='git commit -m "$(gum input)" -m "$(gum write)"'

# if [ -z "$(git status -s -uno | grep -v '^ ' | awk '{print $2}')" ]; then
#     gum confirm "Stage all?" && git add .
# fi
TYPE=$(gum choose "build" "chore" "ci" "docs" "feat" "fix" "perf" "refactor" "revert" "style" "test" "enhance")
SCOPE=$(gum input --placeholder "scope")

# Since the scope is optional, wrap it in parentheses if it has a value.
test -n "$SCOPE" && SCOPE="($SCOPE)"

# Pre-populate the input with the type(scope): so that the user may change it
SUMMARY=$(gum input --value "$TYPE$SCOPE: " --placeholder "Summary of this change")
DESCRIPTION=$(gum write --placeholder "Details of this change")

TASK_ID=$(gum input --value "TASK-ID:" --placeholder "TASK ID OF THIS ISSUE INCLUDING THE TASK PREFIX")

commit_msg=$(
	cat <<EOF
$SUMMARY

$DESCRIPTION

$TASK_ID
EOF
)

# Commit these changes if user confirms
gum confirm "Commit changes?" && echo "$commit_msg" | npx commitlint --strict --verbose --config ../.commitlintrc.js
