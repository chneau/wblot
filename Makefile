.SILENT:
.ONESHELL:
.NOTPARALLEL:
.EXPORT_ALL_VARIABLES:
.PHONY: run exec build clean deps m runmap

NAME=$(shell basename $(CURDIR))

run: build exec clean

exec:
	./bin/${NAME}

buildPublic:
	go-bindata -pkg statik -o ./pkg/statik/statik.go ./assets

build:
	CGO_ENABLED=0 go build -trimpath -o bin/${NAME} -ldflags '-s -w -extldflags "-static"'

clean:
	rm -rf bin

test:
	go test -cover -count=1 ./...

deps:
	go mod init || true
	go mod tidy
	go mod verify

dev:
	go get -u -v github.com/go-bindata/go-bindata/...
