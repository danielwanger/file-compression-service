const API_URL = "https://file-compression-service.onrender.com";
const EXT = { gzip: ".gz", bz2: ".bz2", lzma: ".xz" };

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const dzIdle = document.getElementById("dzIdle");
const dzFile = document.getElementById("dzFile");
const fileNameEl = document.getElementById("fileName");
const fileSizeEl = document.getElementById("fileSize");
const clearFileBtn = document.getElementById("clearFile");
const algorithmGroup = document.getElementById("algorithmGroup");
const compressBtn = document.getElementById("compressBtn");
const decompressBtn = document.getElementById("decompressBtn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const resultBarFill = document.getElementById("resultBarFill");
const statOriginal = document.getElementById("statOriginal");
const statCompressed = document.getElementById("statCompressed");
const statRatio = document.getElementById("statRatio");
const downloadLink = document.getElementById("downloadLink");

let algorithm = "gzip";
let currentFile = null;

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  return `${i === 0 ? value : value.toFixed(1)} ${units[i]}`;
}

function setStatus(text, kind) {
  statusEl.textContent = text;
  statusEl.className = "status" + (kind ? ` is-${kind}` : "");
}

function setFile(file) {
  currentFile = file;
  if (file) {
    dzIdle.hidden = true;
    dzFile.hidden = false;
    fileNameEl.textContent = file.name;
    fileSizeEl.textContent = formatBytes(file.size);
  } else {
    dzIdle.hidden = false;
    dzFile.hidden = true;
  }
  compressBtn.disabled = !file;
  decompressBtn.disabled = !file;
  resultEl.hidden = true;
  setStatus("");
}

// Algorithm segmented control
algorithmGroup.addEventListener("click", (e) => {
  const btn = e.target.closest(".segmented__opt");
  if (!btn) return;
  algorithm = btn.dataset.value;
  [...algorithmGroup.children].forEach((c) => {
    const active = c === btn;
    c.classList.toggle("is-active", active);
    c.setAttribute("aria-checked", String(active));
  });
});

// Dropzone interactions
dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});
fileInput.addEventListener("change", () => setFile(fileInput.files[0] || null));

["dragenter", "dragover"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.add("is-dragover");
  })
);
["dragleave", "drop"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.remove("is-dragover");
  })
);
dropzone.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files[0];
  if (file) setFile(file);
});

clearFileBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  fileInput.value = "";
  setFile(null);
});

async function callApi(endpoint) {
  if (!currentFile) return;

  const originalSize = currentFile.size;
  compressBtn.disabled = true;
  decompressBtn.disabled = true;
  resultEl.hidden = true;
  setStatus(endpoint === "compress" ? "Compressing…" : "Decompressing…", "loading");

  const formData = new FormData();
  formData.append("file", currentFile);

  let response;
  try {
    response = await fetch(`${API_URL}/${endpoint}/${algorithm}`, {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    setStatus("Network error — could not reach the server.", "error");
    compressBtn.disabled = false;
    decompressBtn.disabled = false;
    return;
  }

  if (!response.ok) {
    setStatus(`${endpoint === "compress" ? "Compression" : "Decompression"} failed (${response.status}).`, "error");
    compressBtn.disabled = false;
    decompressBtn.disabled = false;
    return;
  }

  const blob = await response.blob();
  const outSize = blob.size;
  const url = URL.createObjectURL(blob);

  const outName =
    endpoint === "compress"
      ? currentFile.name + EXT[algorithm]
      : currentFile.name.replace(/\.(gz|bz2|xz)$/, "");

  downloadLink.href = url;
  downloadLink.download = outName;

  if (endpoint === "compress") {
    const ratio = originalSize > 0 ? Math.max(0, 1 - outSize / originalSize) : 0;
    statOriginal.textContent = formatBytes(originalSize);
    statCompressed.textContent = formatBytes(outSize);
    statRatio.textContent = `${Math.round(ratio * 100)}%`;
    resultBarFill.style.width = "100%";
    resultEl.hidden = false;
    requestAnimationFrame(() => {
      resultBarFill.style.width = `${Math.max(4, (1 - ratio) * 100)}%`;
    });
  } else {
    statOriginal.textContent = formatBytes(originalSize);
    statCompressed.textContent = formatBytes(outSize);
    statRatio.textContent = "restored";
    resultBarFill.style.width = "100%";
    resultEl.hidden = false;
  }

  setStatus("Done — ready to download.", "ok");
  compressBtn.disabled = false;
  decompressBtn.disabled = false;
}

compressBtn.addEventListener("click", () => callApi("compress"));
decompressBtn.addEventListener("click", () => callApi("decompress"));