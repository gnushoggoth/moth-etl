{-# LANGUAGE OverloadedStrings #-}

module MandelbrotVisualizer where

import Data.Complex
import Data.Word
import qualified Data.ByteString.Lazy as BS
import Codec.Compression.Zlib as Zlib
import Data.Binary.Put
import Numeric (showHex)

-- Complex number iteration for Mandelbrot set
mandelbrotIteration :: Complex Double -> Complex Double -> Int -> Int
mandelbrotIteration c z maxIter
    | magnitude z > 2.0 = 0  -- Escaped
    | iter == maxIter   = maxIter  -- Stable
    | otherwise         = iter
    where 
        iter = go 0
        go n 
            | n >= maxIter = maxIter
            | magnitude newZ > 2.0 = n
            | otherwise = go (n + 1)
            where newZ = z*z + c

-- Generate color based on iteration count
colorMap :: Int -> Int -> (Word8, Word8, Word8)
colorMap maxIter iterations
    | iterations == 0 = (0, 0, 0)  -- Black for escaped points
    | iterations == maxIter = (0, 0, 0)  -- Black for stable points
    | otherwise = 
        let normalized = fromIntegral iterations / fromIntegral maxIter
            r = round $ sin(normalized * 3.14159 * 2) * 127 + 128
            g = round $ sin(normalized * 3.14159 * 2 + 2) * 127 + 128
            b = round $ sin(normalized * 3.14159 * 2 + 4) * 127 + 128
        in (r, g, b)

-- Generate Mandelbrot set data
generateMandelbrotData :: Int -> Int -> Int -> [(Int, Int, (Word8, Word8, Word8))]
generateMandelbrotData width height maxIter = 
    [ (x, y, colorMap maxIter (mandelbrotIteration c (0 :+ 0) maxIter))
    | y <- [0..height-1]
    , x <- [0..width-1]
    , let scaledX = fromIntegral x / fromIntegral width * 4 - 2
          scaledY = fromIntegral y / fromIntegral height * 4 - 2
          c = scaledX :+ scaledY
    ]

-- Generate HTML with embedded Mandelbrot visualization
generateMandelbrotHTML :: Int -> Int -> Int -> String
generateMandelbrotHTML width height maxIter = 
    "<!DOCTYPE html>\n" ++
    "<html lang=\"en\">\n" ++
    "<head>\n" ++
    "    <meta charset=\"UTF-8\">\n" ++
    "    <title>Mandelbrot Set Visualization</title>\n" ++
    "    <style>\n" ++
    "        body { background-color: #0a0a0e; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }\n" ++
    "        canvas { border: 2px solid #ff6188; box-shadow: 0 0 20px rgba(255, 97, 136, 0.5); }\n" ++
    "    </style>\n" ++
    "</head>\n" ++
    "<body>\n" ++
    "    <canvas id=\"mandelbrotCanvas\" width=\"" ++ show width ++ "\" height=\"" ++ show height ++ "\"></canvas>\n" ++
    "    <script>\n" ++
    "    (function() {\n" ++
    "        const canvas = document.getElementById('mandelbrotCanvas');\n" ++
    "        const ctx = canvas.getContext('2d');\n" ++
    "        const imageData = ctx.createImageData(" ++ show width ++ ", " ++ show height ++ ");\n" ++
    "        const data = " ++ formatMandelbrotData ++ ";\n" ++
    "\n" ++
    "        data.forEach(([x, y, [r, g, b]]) => {\n" ++
    "            const index = (y * " ++ show width ++ " + x) * 4;\n" ++
    "            imageData.data[index] = r;\n" ++
    "            imageData.data[index + 1] = g;\n" ++
    "            imageData.data[index + 2] = b;\n" ++
    "            imageData.data[index + 3] = 255;\n" ++
    "        });\n" ++
    "\n" ++
    "        ctx.putImageData(imageData, 0, 0);\n" ++
    "    })();\n" ++
    "    </script>\n" ++
    "</body>\n" ++
    "</html>"
    where
        mandelbrotData = generateMandelbrotData width height maxIter
        formatMandelbrotData = 
            "[" ++ 
            intercalate "," 
                (map (\(x, y, (r, g, b)) -> 
                    "[" ++ show x ++ "," ++ show y ++ ",[" ++ 
                    show r ++ "," ++ show g ++ "," ++ show b ++ "]]") 
                mandelbrotData) ++ 
            "]"

-- Main function to generate the Mandelbrot visualization
main :: IO ()
main = do
    let width = 800
        height = 600
        maxIter = 100
    writeFile "mandelbrot.html" (generateMandelbrotHTML width height maxIter)
    putStrLn "Mandelbrot visualization generated in mandelbrot.html"
