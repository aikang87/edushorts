import json, os, sys, urllib.request

url = os.environ["OLLAMA_HOST"] + "/api/generate"
prompt = " ".join(sys.argv[1:])
data = {"model": "smol", "prompt": prompt, "stream": False}
r = urllib.request.Request(url, json.dumps(data).encode())
res = json.load(urllib.request.urlopen(r))
print(res["response"].strip())
