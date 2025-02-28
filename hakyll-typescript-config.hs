{-# LANGUAGE OverloadedStrings #-}

module Main where

import Hakyll
import System.Process (readProcess)
import System.Exit (ExitCode(..))
import Control.Monad (when)
import System.FilePath (takeBaseName, replaceExtension)
import Data.Monoid ((<>))

-- Custom TypeScript compilation rule
-- Compiles TypeScript files using esbuild
compileTypeScript :: Rules ()
compileTypeScript = do
    match "src/typescript/**/*.ts" $ do
        route $ customRoute $ \identifier ->
            "dist/js/" ++ takeBaseName (toFilePath identifier) ++ ".js"
        
        compile $ do
            let typeScriptPath = toFilePath <$> getResourceFilePath
            
            -- Compile TypeScript using esbuild
            result <- unsafeCompiler $ do
                (exitCode, stdout, stderr) <- readProcessWithExitCode 
                    "esbuild" 
                    [ head typeScriptPath
                    , "--bundle"
                    , "--target=es2020"
                    , "--format=esm"
                    , "--minify"
                    , "--sourcemap"
                    , "-o" ++ replaceExtension (head typeScriptPath) ".js"
                    ] 
                    ""
                
                case exitCode of
                    ExitSuccess -> return stdout
                    ExitFailure _ -> error $ "TypeScript compilation failed: " ++ stderr

            makeItem result

main :: IO ()
main = hakyllWith defaultConfiguration $ do
    -- Compile TypeScript
    compileTypeScript

    -- Match and compile Markdown posts
    match "src/markdown/posts/*" $ do
        route $ setExtension "html"
        compile $ do
            pandocCompiler
                >>= loadAndApplyTemplate "src/html/templates/post.html"    postCtx
                >>= loadAndApplyTemplate "src/html/templates/default.html" postCtx
                >>= relativizeUrls

    -- Compile static assets
    match "static/**/*" $ do
        route idRoute
        compile copyFileCompiler

    -- Create index page
    match "src/markdown/index.md" $ do
        route $ setExtension "html"
        compile $ do
            posts <- recentFirst =<< loadAll "src/markdown/posts/*"
            let indexCtx =
                    listField "posts" postCtx (return posts) `mappend`
                    defaultContext

            pandocCompiler
                >>= applyAsTemplate indexCtx
                >>= loadAndApplyTemplate "src/html/templates/default.html" indexCtx
                >>= relativizeUrls

    -- Compile HTML templates
    match "src/html/templates/*" $ compile templateBodyCompiler

-- Context for blog posts
postCtx :: Context String
postCtx =
    dateField "date" "%B %e, %Y" `mappend`
    defaultContext
