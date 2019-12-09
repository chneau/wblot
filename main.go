package main

import (
	"image"
	"image/draw"
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
	log.Println(greyimg.Rect.Max)
	for i := 0; i < 14; i++ {
		bestsubimg := findBest(42, 12, greyimg)
		draw.Draw(greyimg, bestsubimg.Bounds(), image.Black, image.ZP, draw.Src)
	}
	ce(imgio.Save("output/output.png", greyimg, imgio.PNGEncoder()))
}

func findBest(dx, dy int, img *image.NRGBA) image.Image {
	best := 0
	bestsubimg := image.Image(nil)
	for i := 0; i < img.Rect.Max.X-dx; i++ {
		for j := 0; j < img.Rect.Max.Y-dy; j++ {
			subimg := img.SubImage(image.Rect(i, j, i+dx, j+dy))
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
			if tot > best {
				best = tot
				bestsubimg = subimg
			}
		}
	}
	return bestsubimg
}
