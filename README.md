# file-compression-service

Stateless file compression API (supporting gzip, bz2, lzma). Files are uploaded to a backend service, compressed in-memory, and never written to disk or stored server-side.

## Features
- Upload any file and compress it via the web interface.
- Choose between gzip, bz2 and lzma algorithms.
- See compression ratio before downloading.
- Decompress files back to original.

## Tech Stack
- Backend: Python, FastAPI
- Frontend: HTML/ CSS/ JavaScript
- Deployment: Render (backend), GitHub Pages (frontend)
