package main

import (
	"encoding/base64"
	"image"
	"image/color"
	_ "image/gif"
	_ "image/jpeg"
	_ "image/png"
	"log"
	"net/http"
	"os"
	"os/signal"
	"runtime"
	"sort"
	"strings"

	"github.com/chneau/limiter"
	"github.com/gin-gonic/gin"
	"github.com/mattn/go-colorable"
)

func init() {
	log.SetPrefix("[WBLOT] ")
	log.SetOutput(os.Stdout)
	log.SetFlags(log.Ltime | log.Lshortfile)
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	go func() {
		<-quit
		println()
		os.Exit(0)
	}()
	gin.DefaultWriter = colorable.NewColorableStdout()
}

func ce(err error) {
	if err != nil {
		log.Fatalln(err)
	}
}

func Gray(img image.Image) *image.Gray {
	grayImg := image.NewGray(img.Bounds())
	limit := limiter.New(runtime.NumCPU())
	for y := img.Bounds().Min.Y; y < img.Bounds().Max.Y; y++ {
		y := y
		limit.Execute(func() {
			for x := img.Bounds().Min.X; x < img.Bounds().Max.X; x++ {
				R, G, B, _ := img.At(x, y).RGBA()
				Y := (0.2126*float64(R) + 0.7152*float64(G) + 0.0722*float64(B)) * (255.0 / 65535)
				grayPix := color.Gray{uint8(Y)}
				grayImg.Set(x, y, grayPix)
			}
		})
	}
	limit.Wait()
	return grayImg
}

func subGray(img *image.Gray, rect image.Rectangle) *image.Gray {
	grayImg := image.NewGray(image.Rect(0, 0, rect.Dx(), rect.Dy()))
	for y := rect.Min.Y; y < rect.Max.Y; y++ {
		for x := rect.Min.X; x < rect.Max.X; x++ {
			grayImg.SetGray(x-rect.Min.X, y-rect.Min.Y, img.GrayAt(x, y))
		}
	}
	return grayImg
}

type Point struct {
	X     int `json:"x"`
	Y     int `json:"y"`
	Score int `json:"score"`
}

func modulo(template *image.Gray, mod int) []image.Point {
	rect := template.Rect
	points := []image.Point{}
	for y := 0; y < rect.Dx(); y++ {
		for x := 0; x < rect.Dy(); x++ {
			i := y*x + x
			if i%mod != 0 {
				continue
			}
			points = append(points, image.Point{X: x, Y: y})
		}
	}
	return points
}

func light(template *image.Gray, level uint8) []image.Point {
	rect := template.Rect
	points := []image.Point{}
	for y := 0; y < rect.Dx(); y++ {
		for x := 0; x < rect.Dy(); x++ {
			if template.GrayAt(x, y).Y < level {
				continue
			}
			points = append(points, image.Point{X: x, Y: y})
		}
	}
	return points
}

func removeOverlapping(points []Point, ir, tr image.Rectangle) []Point {
	img := image.NewGray(ir)
	overlap := func(p Point) bool {
		i := 0
		for x := p.X; x < p.X+tr.Max.X; x += tr.Max.X - 1 {
			for y := p.Y; y < p.Y+tr.Max.Y; y += tr.Max.Y - 1 {
				i++
				if img.GrayAt(x, y).Y != 0 {
					return true
				}
			}
		}
		return false
	}
	mark := func(p Point) {
		for x := p.X; x < p.X+tr.Max.X; x++ {
			for y := p.Y; y < p.Y+tr.Max.Y; y++ {
				img.SetGray(x, y, color.Gray{Y: 1})
			}
		}
	}
	result := []Point{}
	for i := range points {
		if overlap(points[i]) {
			continue
		}
		mark(points[i])
		result = append(result, points[i])
	}
	return result
}

func templateMatching(img, template *image.Gray) []Point {
	// coorsToMatch := modulo(template, len(template.Pix)/50)
	coorsToMatch := light(template, 25)
	log.Println(len(template.Pix), len(coorsToMatch))
	limit := limiter.New(runtime.NumCPU())
	maxy := img.Rect.Dy() - template.Rect.Dy()
	maxx := img.Rect.Dx() - template.Rect.Dx()
	scores := make([]Point, maxy*maxx)
	for y := 0; y < maxy; y++ {
		y := y
		limit.Execute(func() {
			for x := 0; x < maxx; x++ {
				totaDiff := 0
				for _, c := range coorsToMatch {
					a := template.GrayAt(c.X, c.Y).Y
					b := img.GrayAt(x+c.X, y+c.Y).Y
					if b > a {
						a, b = b, a
					}
					totaDiff += int(a - b)
				}
				scores[x*maxy+y] = Point{X: x, Y: y, Score: totaDiff}
			}
		})
	}
	limit.Wait()
	sort.Slice(scores, func(i, j int) bool {
		if scores[i].Score == scores[j].Score {
			return scores[i].Y+scores[i].X < scores[j].Y+scores[j].X
		}
		return scores[i].Score < scores[j].Score
	})
	return scores
}

func main() {
	r := gin.Default()
	r.Static("/", "public")
	r.POST("/image", func(c *gin.Context) {
		obj := struct {
			X, Y, Width, Height int
			Image               string
		}{}
		if err := c.ShouldBindJSON(&obj); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		img, _, err := image.Decode(base64.NewDecoder(base64.StdEncoding, strings.NewReader(obj.Image[strings.Index(obj.Image, ",")+1:])))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		grayImage := Gray(img)
		template := subGray(grayImage, image.Rect(obj.X, obj.Y, obj.X+obj.Width, obj.Y+obj.Height))
		allPoints := templateMatching(grayImage, template)
		filtered := removeOverlapping(allPoints[:len(allPoints)/40], grayImage.Rect, template.Rect)
		c.JSON(200, gin.H{"result": filtered})
	})

	log.Println("http://127.0.0.1:8080")
	err := r.Run()
	ce(err)
}
