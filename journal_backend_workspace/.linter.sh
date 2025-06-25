#!/bin/bash
cd /home/kavia/workspace/code-generation/moodmemo-70882-ebd6eb2e/journal_backend_workspace/journal_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

