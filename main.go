package main

import (
	"fmt"
	"image"
	"log"
	"os"
	"os/signal"

	"github.com/disintegration/imaging"

	"github.com/anthonynsimon/bild/imgio"
)

func init() {
	log.SetPrefix("[WBLOT] ")
	log.SetOutput(os.Stdout)
	log.SetFlags(log.LstdFlags | log.Llongfile)
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	go func() {
		<-quit
		println()
		os.Exit(0)
	}()
}

func ce(err error) {
	if err != nil {
		log.Fatalln(err)
	}
}

// assisted click, click somewhere and it will auto focus on best area
func main() {
	_ = os.RemoveAll("output")
	_ = os.MkdirAll("output", os.ModePerm)
	img, err := imgio.Open("test/wee.jpg")
	ce(err)
	greyimg := imaging.Grayscale(img)
	dx, dy := 30, 10
	log.Println(greyimg.Rect.Max)
	best := 0
	for i := 0; i < greyimg.Rect.Max.X-dx; i++ {
		for j := 0; j < greyimg.Rect.Max.Y-dy; j++ {
			subimg := greyimg.SubImage(image.Rect(i, j, i+dx, j+dy))
			tot := 0
			for x := i; x < i+dx; x++ {
				for y := j; y < j+dy; y++ {
					col := subimg.At(x, y)
					r, g, b, _ := col.RGBA()
					tot += int(r)
					tot += int(g)
					tot += int(b)
				}
			}
			if tot > best && tot > 14099277 {
				log.Println(tot)
				_ = imgio.Save(fmt.Sprintf("output/output%010d.png", tot), subimg, imgio.PNGEncoder())
				best = tot
			}
		}
	}
	ce(imgio.Save("output/output.png", greyimg, imgio.PNGEncoder()))
}
