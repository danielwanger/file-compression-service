const API_URL = "https://file-compression-service.onrender.com";

async function compress() {
    const file = document.getElementById("fileInput").files[0];
    const algorithm = document.getElementById("algorithm").value;
    const status = document.getElementById("status");

    if (!file) {
        status.textContent = "Please select a file.";
        return;
    }

    status.textContent = "Compressing...";

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/compress/${algorithm}`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        status.textContent = "Compression failed.";
        return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name + (algorithm === "gzip" ? ".gz" : algorithm === "bz2" ? ".bz2" : ".xz");
    a.click();

    status.textContent = "Done!";
}

async function decompress() {
    const file = document.getElementById("fileInput").files[0];
    const algorithm = document.getElementById("algorithm").value;
    const status = document.getElementById("status");

    if (!file) {
        status.textContent = "Please select a file.";
        return;
    }

    status.textContent = "Decompressing...";

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/decompress/${algorithm}`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        status.textContent = "Decompression failed.";
        return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.(gz|bz2|xz)$/, "");
    a.click();

    status.textContent = "Done!";
}