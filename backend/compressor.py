import gzip
import bz2
import lzma

def compress_gzip(data: bytes) -> bytes:
    return gzip.compress(data)

def decompress_gzip(data: bytes) -> bytes: 
    return gzip.decompress(data)

def compress_bz2(data: bytes) -> bytes:
    return bz2.compress(data)

def decompress_bz2(data: bytes) -> bytes:
    return bz2.decompress(data)

def compress_lzma(data: bytes) -> bytes:
    return lzma.compress(data)

def decompress_lzma(data: bytes) -> bytes:
    return lzma.decompress(data)