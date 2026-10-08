FROM python:3.12-slim
WORKDIR /work
RUN pip install --no-cache-dir \
    numpy pandas scikit-learn jupyterlab
EXPOSE 8888
CMD ["jupyter", "lab", "--ip=0.0.0.0", \
     "--no-browser", "--allow-root"]
