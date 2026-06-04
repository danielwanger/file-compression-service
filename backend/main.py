from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from compressor import compress_gzip, compress_bz2, compress_lzma, decompress_gzip, decompress_bz2, decompress_lzma

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

COMPRESS_ALGORITHMS = {
    "gzip": (compress_gzip, "application/gzip", ".gz"),
    "bz2": (compress_bz2, "application/x-bzip2", ".bz2"),
    "lzma": (compress_lzma, "application/x-xz", ".xz"),
}

DECOMPRESS_ALGORITHMS = {
    "gzip": (decompress_gzip, ".gz"),
    "bz2": (decompress_bz2, ".bz2"),
    "lzma": (decompress_lzma, ".xz"),
}

@app.get("/")
def root():
    return {"message": "File Compression Service"}

@app.post("/compress/{algorithm}")
async def compress(algorithm: str, file: UploadFile = File(...)):
    if algorithm not in COMPRESS_ALGORITHMS:
        raise HTTPException(status_code=400, detail=f"Unknown algorithm: {algorithm}")
    
    compressor_var, media_type, extension = COMPRESS_ALGORITHMS[algorithm]
    data = await file.read()
    compressed = compressor_var(data)

    return Response(
        content=compressed,
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={file.filename}{extension}"}
    )

@app.post("/decompress/{algorithm}")
async def decompress(algorithm: str, file: UploadFile = File(...)):
    if algorithm not in DECOMPRESS_ALGORITHMS:
        raise HTTPException(status_code=400, detail=f"Unknown algorithm: {algorithm}")
    
    decompressor, extension = DECOMPRESS_ALGORITHMS[algorithm]
    data = await file.read()
    
    try:
        decompressed = decompressor(data)
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to decompress file")
    
    filename = file.filename.removesuffix(extension)
    
    return Response(
        content=decompressed,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )