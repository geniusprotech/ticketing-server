# Gunakan Node.js versi LTS Alpine (ringan)
FROM node:20-alpine

# Install dependensi sistem yang dibutuhkan Prisma (OpenSSL)
RUN apk -U add --no-cache openssl

# Set direktori kerja dalam container
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install semua dependencies (termasuk devDependencies untuk build SWC)
# Gunakan 'npm ci' agar instalasi bersih sesuai lockfile
RUN npm ci

# Copy folder prisma untuk generate client
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy seluruh source code
COPY . .

# Build TypeScript menggunakan script 'build' di package.json (SWC)
RUN npm run build

# (Opsional) Hapus devDependencies untuk menghemat ukuran, 
# tapi hati-hati karena script 'migrate-deploy' butuh 'prisma' CLI yg ada di devDeps.
# Jika ingin image sangat kecil, steps ini bisa dibuat multi-stage kompleks.
# Untuk sekarang kita keep agar aman.

# Expose port aplikasi (sesuaikan dengan port Fastify kamu, misal 3000 atau 8080)
EXPOSE 5000

# Command untuk menjalankan aplikasi
CMD ["npm", "run", "start"]