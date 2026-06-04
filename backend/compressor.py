import gzip

def compress_gzip(data: bytes) -> bytes:
    return gzip.compress(data)

def decompress_gzip(data: bytes) -> bytes: 
    return gzip.decompress(data)