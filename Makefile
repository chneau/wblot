.SILENT:
.ONESHELL:
.NOTPARALLEL:
.EXPORT_ALL_VARIABLES:
.PHONY: run exec build clean deps m runmap

name=$(shell basename $(CURDIR))

run: build exec clean

exec:
	./bin/${name}

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

up-client:
	docker build -t poeket-client-share -f client.Dockerfile .
	docker rm -f poeket-client-share || true
	docker run -d --restart always --name poeket-client-share --hostname share -e GOTTY_MAX_CONNECTION=2 -e GOTTY_PERMIT_ARGUMENTS=true -e GOTTY_PORT=9090 --net=host poeket-client-share

up-server:
	docker build -t poeket-server -f Dockerfile .
	docker rm -f poeket-server || true
	docker run -d --restart always --name poeket-server --hostname poeket-server -e POESESSID=63327098e6b044b27c67e5c16ff18a9b --net=host poeket-server
