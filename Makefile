.SILENT:
.ONESHELL:
.NOTPARALLEL:
.EXPORT_ALL_VARIABLES:
.PHONY: run exec build clean deps m runmap

name=$(shell basename $(CURDIR))

run: buildPublic build exec clean

exec:
	./bin/${name}

buildPublic:
	go-bindata -pkg statik -o ./pkg/statik/statik.go ./assets

build:
	CGO_ENABLED=0 go build -o bin/${name} -ldflags '-s -w -extldflags "-static"'

clean:
	rm -rf bin

test:
	go test -cover -count=1 ./...

deps:
	govendor init
	govendor add +e
	govendor update +v

dev:
	go get -u -v github.com/kardianos/govendor
	go get -u -v github.com/go-bindata/go-bindata/...
