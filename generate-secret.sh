#!/bin/bash
# generate-secret.sh - Generate NextAuth secret

echo "Generating NextAuth secret..."

# Generate a secure 32-byte random string and encode it in base64
SECRET=$(openssl rand -base64 32)

echo ""
echo "Your NextAuth secret:"
echo "NEXTAUTH_SECRET=$SECRET"
echo ""
echo "Add this to your .env.local file"
echo ""

# Alternative method for systems without openssl
echo "Alternative method (Node.js):"
echo "node -e \"console.log('NEXTAUTH_SECRET=' + require('crypto').randomBytes(32).toString('base64'))\""