from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import Response
from compressor import compress_gzip, compress_bz2, compress_lzma

app = FastAPI()

ALGORITHMS = {
    "gzip": (compress_gzip, "application/gzip", ".gz"),
    "bz2": (compress_bz2, "application/x-bzip2", ".bz2"),
    "lzma": (compress_lzma, "application/x-xz", ".xz"),
}

@app.get("/")
def root():
    return {"message": "File Compression Service"}

@app.post("/compress/{algorithm}")
async def compress(algorithm: str, file: UploadFile = File(...)):
    if algorithm not in ALGORITHMS:
        raise HTTPException(status_code=400, detail=f"Unknown algorithm: {algorithm}")
    
    compressor_var, media_type, extension = ALGORITHMS[algorithm]
    data = await file.read()
    compressed = compressor_var(data)

    return Response(
        content=compressed,
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={file.filename}{extension}"}
    )