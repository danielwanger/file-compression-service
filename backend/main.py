from fastapi import FastAPI, UploadFile, File
from fastapi.responses import Response
from compressor import compress_gzip

app = FastAPI()

@app.get("/")
def root():
    return {"message": "File Compression Service"}

@app.post("/compress/gzip")
async def compress(file: UploadFile = File(...)):
    data = await file.read()
    compressed = compress_gzip(data)
    return Response(
        content=compressed,
        media_type="application/gzip",
        headers={"Content-Disposition": f"attachment; filename={file.filename}.gz"}
    )