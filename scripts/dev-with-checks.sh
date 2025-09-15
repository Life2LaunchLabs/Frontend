#!/bin/bash

# Start TypeScript checker in watch mode
echo "🔍 Starting TypeScript checker..."
npm run dev:check &
TYPECHECK_PID=$!

# Wait a moment for initial type check
sleep 2

# Start Vite dev server
echo "🚀 Starting development server..."
npm run dev &
DEV_PID=$!

# Function to cleanup processes on script exit
cleanup() {
    echo "🛑 Stopping development tools..."
    kill $TYPECHECK_PID 2>/dev/null
    kill $DEV_PID 2>/dev/null
    exit
}

# Set up trap to cleanup on script termination
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait