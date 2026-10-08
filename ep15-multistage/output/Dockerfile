FROM golang:1.22-alpine AS build
WORKDIR /src
COPY main.go .
RUN go build -o hello main.go

FROM alpine
COPY --from=build /src/hello /hello
CMD ["/hello"]
