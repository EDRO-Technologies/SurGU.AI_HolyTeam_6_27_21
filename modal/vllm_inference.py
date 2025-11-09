import json
from typing import Any

import aiohttp

import modal

vllm_image = (
    modal.Image.from_registry("nvidia/cuda:12.8.0-devel-ubuntu22.04", add_python="3.12")
    .entrypoint([])
    .uv_pip_install(
        "vllm==0.11.0",
        "huggingface_hub[hf_transfer]==0.35.0",
        "flashinfer-python==0.3.1",
        "bitsandbytes>=0.46.1",
    )
    .env(
        {
            "HF_HUB_ENABLE_HF_TRANSFER": "1",
            "HF_TOKEN": "HF_TOKEN_HERE",
        }
    )
)

MODEL_NAME = "unsloth/gemma-3-12b-it-bnb-4bit"
MODEL_REVISION = "826e729dbaeea4ecb143738eed2bcf3539ebf7bf"

hf_cache_vol = modal.Volume.from_name("huggingface-cache", create_if_missing=True)
vllm_cache_vol = modal.Volume.from_name("vllm-cache", create_if_missing=True)

FAST_BOOT = True

app = modal.App("example-vllm-inference")

N_GPU = 1
MINUTES = 60
VLLM_PORT = 8000


@app.function(
    image=vllm_image,
    gpu=f"L4:{N_GPU}",
    scaledown_window=15 * MINUTES,
    timeout=10 * MINUTES,
    volumes={
        "/root/.cache/huggingface": hf_cache_vol,
        "/root/.cache/vllm": vllm_cache_vol,
    },
)
@modal.concurrent(max_inputs=32)
@modal.web_server(port=VLLM_PORT, startup_timeout=10 * MINUTES)
def serve():
    import subprocess

    cmd = [
        "vllm",
        "serve",
        "--uvicorn-log-level=info",
        MODEL_NAME,
        "--revision",
        MODEL_REVISION,
        "--served-model-name",
        MODEL_NAME,
        "llm",
        "--host",
        "0.0.0.0",
        "--port",
        str(VLLM_PORT),
        "--api-key",
        "very-secure-and-random-token",
    ]

    # enforce-eager disables both Torch compilation and CUDA graph capture
    # default is no-enforce-eager. see the --compilation-config flag for tighter control
    cmd += ["--enforce-eager" if FAST_BOOT else "--no-enforce-eager"]

    # assume multiple GPUs are for splitting up large matrix multiplications
    cmd += ["--tensor-parallel-size", str(N_GPU)]

    print(cmd)

    subprocess.Popen(" ".join(cmd), shell=True)
