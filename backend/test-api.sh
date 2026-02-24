#!/bin/bash
# Test script for FundingIntel Backend Translation API

echo "============================================================"
echo "FundingIntel Backend Translation API - Test Suite"
echo "============================================================"
echo ""

# Check if server is running
echo "1️⃣  Testing health check..."
HEALTH_RESPONSE=$(curl -s http://localhost:3000/health)
if [ $? -eq 0 ]; then
    echo "✅ Server is running"
    echo "$HEALTH_RESPONSE" | jq .
else
    echo "❌ Server is not running. Please start it with: cd backend && npm start"
    exit 1
fi

echo ""
echo "2️⃣  Testing translation endpoint (no translation needed)..."
curl -s -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello World","targetLanguage":"en","sourceLanguage":"en"}' | jq .

echo ""
echo "3️⃣  Testing translation endpoint with missing field..."
curl -s -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"targetLanguage":"hi"}' | jq .

echo ""
echo "4️⃣  Testing batch translation endpoint (no translation needed)..."
curl -s -X POST http://localhost:3000/api/translate/batch \
  -H "Content-Type: application/json" \
  -d '{"texts":["Hello","World","Test"],"targetLanguage":"en","sourceLanguage":"en"}' | jq .

echo ""
echo "5️⃣  Testing 404 endpoint..."
curl -s http://localhost:3000/api/unknown | jq .

echo ""
echo "============================================================"
echo "Test complete! Check the backend server terminal for logs."
echo "============================================================"
