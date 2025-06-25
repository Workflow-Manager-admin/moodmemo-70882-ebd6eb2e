#!/bin/bash
cd /home/kavia/workspace/code-generation/moodmemo-70882-ebd6eb2e/journal_frontend_workspace/journal_frontend
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

