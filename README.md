# file-compression-service

In-Browser file compression tool (supporting gzip, bz2, lzma). Files are processed in-memory and not written to disk or stored server-side.

## Features
- Upload any file and compress it via browser.
- Choose between gzip, bz2 and lzma algorithms.
- See compression ratio before downloading.
- Decompress files back to original.

## Tech Stack
- Backend: Python, FastAPI
- Frontend: HTML/ CSS/ JavaScript
- Deployment: Render (backend), Netlify (frontend)
