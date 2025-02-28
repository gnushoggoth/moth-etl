;; NLP Core: A Functional Approach to Natural Language Processing
;; This namespace contains core functions for processing text using functional paradigms

(ns nlp.core
  (:require [clojure.string :as str]
            [clojure.set :as set]))

;; =============================================================================
;; MODULE 1: TOKENIZATION
;; =============================================================================
;; Tokenization in the functional paradigm treats text transformation as a series
;; of composable functions that process immutable data structures.

(defn tokenize
  "Decomposes text into a sequence of tokens using functional transformation.
   Returns a vector of token maps with normalized attributes."
  [text]
  (-> text
      (str/lower-case)
      (str/replace #"[^\w\s]" " ")  ; Replace non-alphanumeric with space
      (str/split #"\s+")            ; Split on whitespace
      (->> 
        (remove empty?)
        (map-indexed 
          (fn [idx token] 
            {:id idx
             :text token
             :length (count token)
             :position idx})))))

;; Frequency analysis is achieved through functional reduction
(defn frequency-analysis
  "Calculates token frequencies using Clojure's reducers.
   Returns a map of tokens to frequency counts."
  [tokens]
  (reduce 
    (fn [freq-map token]
      (update freq-map (:text token) (fnil inc 0)))
    {} 
    tokens))

;; =============================================================================
;; MODULE 2: VECTOR EMBEDDINGS
;; =============================================================================
;; Implementing vector embeddings using Clojure's vector operations
;; We model a simplified version with random embeddings for demonstration

(def ^:private vector-dimension 4)

(defn generate-embedding
  "Creates a deterministic vector embedding for a token.
   Uses hash-based approach for demo purposes."
  [token]
  (let [seed (reduce + (map int token))]
    (vec 
      (for [i (range vector-dimension)]
        (float 
          (/ (Math/sin (+ seed (* i 0.1))) 2.0))))))

(defn token->vector
  "Transforms a token into its vector representation."
  [token]
  (assoc token :vector (generate-embedding (:text token))))

(defn cosine-similarity
  "Calculates cosine similarity between two vectors."
  [vec1 vec2]
  (let [dot-product (reduce + (map * vec1 vec2))
        magnitude1 (Math/sqrt (reduce + (map #(* % %) vec1)))
        magnitude2 (Math/sqrt (reduce + (map #(* % %) vec2)))]
    (/ dot-product (* magnitude1 magnitude2))))

;; =============================================================================
;; MODULE 3: SENTIMENT ANALYSIS
;; =============================================================================
;; Sentiment analysis using pure functions and immutable data structures

(def ^:private sentiment-lexicon
  {"good" 0.8, "great" 0.9, "excellent" 1.0, "happy" 0.7, "like" 0.6, 
   "bad" -0.7, "terrible" -0.9, "awful" -1.0, "sad" -0.6, "dislike" -0.6,
   "love" 0.9, "hate" -0.8})

(defn analyze-sentiment
  "Analyzes sentiment using a lexicon-based approach.
   Returns a map with sentiment score and metadata."
  [tokens]
  (let [text-tokens (map :text tokens)
        sentiment-words (filter sentiment-lexicon text-tokens)
        sentiment-values (map sentiment-lexicon sentiment-words)
        average-sentiment (if (seq sentiment-values)
                            (/ (reduce + sentiment-values) (count sentiment-values))
                            0.0)]
    {:score average-sentiment
     :magnitude (Math/abs average-sentiment)
     :label (cond
              (> average-sentiment 0.3) :positive
              (< average-sentiment -0.3) :negative
              :else :neutral)
     :components (into {} (map 
                            (fn [word] [word (sentiment-lexicon word)])
                            sentiment-words))}))

;; =============================================================================
;; MODULE 4: CONTEXT ANALYSIS
;; =============================================================================
;; Using Clojure's sequence operations to analyze contexts and co-occurrences

(defn generate-ngrams
  "Generates n-grams from a sequence of tokens."
  [tokens n]
  (partition n 1 (map :text tokens)))

(defn co-occurrence-matrix
  "Creates a co-occurrence matrix for tokens within a window size.
   Returns a map of token pairs to co-occurrence counts."
  [tokens window-size]
  (reduce
    (fn [matrix window]
      (let [pairs (for [i (range (count window))
                        j (range (count window))
                        :when (and (not= i j) (< i j))]
                    [(nth window i) (nth window j)])]
        (reduce
          (fn [m pair] (update m pair (fnil inc 0)))
          matrix
          pairs)))
    {}
    (partition window-size 1 (map :text tokens))))

;; =============================================================================
;; MODULE 5: TEXT GENERATION
;; =============================================================================
;; Markov chain-based text generation using Clojure's functional approach

(defn build-markov-model
  "Builds a Markov chain model from token sequences."
  [tokens order]
  (reduce
    (fn [model ngram]
      (let [context (vec (butlast ngram))
            next-token (last ngram)]
        (update-in model [context next-token] (fnil inc 0))))
    {}
    (partition (inc order) 1 (map :text tokens))))

(defn generate-text
  "Generates text using a Markov chain model."
  [model initial-state max-length]
  (loop [result initial-state
         current-state (vec (take-last (count (first (keys model))) initial-state))
         tokens-generated (count initial-state)]
    (if (or (>= tokens-generated max-length)
            (not (contains? model current-state)))
      result
      (let [possible-next (model current-state)
            ; Select based on probability weights
            next-token (first 
                         (first 
                           (shuffle 
                             (mapcat 
                               (fn [[token count]] (repeat count token)) 
                               possible-next))))
            new-state (conj (vec (rest current-state)) next-token)]
        (recur 
          (conj result next-token)
          new-state
          (inc tokens-generated))))))

;; =============================================================================
;; Process Pipeline
;; =============================================================================
;; Composing functions into a complete NLP pipeline using Clojure's threading

(defn process-text
  "Processes text through the complete NLP pipeline, demonstrating
   Clojure's approach to function composition."
  [text]
  (let [tokens (tokenize text)
        tokens-with-vectors (map token->vector tokens)
        frequency-data (frequency-analysis tokens)
        sentiment-data (analyze-sentiment tokens)
        ngrams (generate-ngrams tokens 3)
        co-occurrences (co-occurrence-matrix tokens 5)]
    {:tokens tokens-with-vectors
     :token-count (count tokens)
     :unique-tokens (count frequency-data)
     :frequency frequency-data
     :sentiment sentiment-data
     :ngrams (take 10 ngrams)
     :co-occurrences (take 10 co-occurrences)}))

;; Example usage:
(comment
  (def sample-text "Natural language processing is a subfield of linguistics, computer science, and artificial intelligence concerned with the interactions between computers and human language.")
  
  (def results (process-text sample-text))
  
  (println "Number of tokens:" (:token-count results))
  (println "Sentiment score:" (get-in results [:sentiment :score]))
  
  ;; Examine vector similarities
  (let [tokens (:tokens results)
        pairs (for [i (range (count tokens))
                    j (range (count tokens))
                    :when (< i j)]
                [(get-in tokens [i :text])
                 (get-in tokens [j :text])
                 (cosine-similarity 
                   (get-in tokens [i :vector]) 
                   (get-in tokens [j :vector]))])]
    (take 5 (reverse (sort-by last pairs)))))
