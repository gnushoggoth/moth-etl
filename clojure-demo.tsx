import React, { useState, useEffect } from 'react';
import { Code, BookOpen, Hash, Play, GitBranch, Eye } from 'lucide-react';

const ClojureNLPPlayground = () => {
  const [inputText, setInputText] = useState(
    "Natural language processing in Clojure leverages functional paradigms for elegant text analysis."
  );
  const [tokens, setTokens] = useState([]);
  const [activeTab, setActiveTab] = useState('repl');
  const [sentimentScore, setSentimentScore] = useState(0);
  const [processingLog, setProcessingLog] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  
  // Add to processing log
  const log = (message) => {
    setProcessingLog(prev => [...prev.slice(-9), message]);
  };
  
  // Simulation of Clojure processing
  useEffect(() => {
    if (inputText) {
      log("user=> (process-text input-string)");
      setTimeout(() => {
        // Tokenize
        const rawTokens = inputText
          .toLowerCase()
          .replace(/[^\w\s]/g, ' ')
          .split(/\s+/)
          .filter(t => t.length > 0);
          
        // Calculate sentiment
        const sentimentValues = {
          "processing": 0.3, "functional": 0.6, "elegant": 0.7, "paradigms": 0.2,
          "leverages": 0.4, "clojure": 0.2, "natural": 0.1, "language": 0.1
        };
        
        let totalSentiment = 0;
        const tokensFound = rawTokens.filter(t => sentimentValues[t]);
        tokensFound.forEach(t => totalSentiment += (sentimentValues[t] || 0));
        const avgSentiment = tokensFound.length > 0 ? totalSentiment / tokensFound.length : 0;
        
        // Create processed tokens
        const processedTokens = rawTokens.map((text, idx) => {
          // Create deterministic but seemingly random values
          const hash = text.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
          
          return {
            id: idx,
            text,
            vector: [
              Math.sin(hash * 0.1) * 0.5,
              Math.cos(hash * 0.2) * 0.5,
              Math.sin(hash * 0.3) * 0.5,
              Math.cos(hash * 0.4) * 0.5
            ],
            length: text.length,
            frequency: 1,
            sentiment: sentimentValues[text] || 0
          };
        });
        
        setTokens(processedTokens);
        setSentimentScore(avgSentiment);
        log(`=> Processed ${processedTokens.length} tokens`);
      }, 500);
    }
  }, [inputText]);
  
  const getTokenStyle = (token) => {
    // Base monochromatic styling
    const importance = 0.2 + (token.length / 10); // Longer tokens appear more important
    const opacity = 0.4 + (importance * 0.6);
    return {
      backgroundColor: `rgba(255, 255, 255, ${opacity * 0.2})`,
      border: `1px solid rgba(255, 255, 255, ${opacity * 0.3})`,
      padding: '4px 8px',
      margin: '2px',
      borderRadius: '2px',
      cursor: 'pointer',
      fontSize: `${0.7 + (importance * 0.3)}rem`
    };
  };
  
  const formatClojureCode = (code) => {
    // Very simple formatting for display purposes
    return code.split('\n').map((line, i) => (
      <div key={i} className="whitespace-pre">
        {line.startsWith(';') 
          ? <span className="text-gray-500">{line}</span> 
          : line}
      </div>
    ));
  };
  
  const renderREPL = () => (
    <div className="font-mono text-xs bg-gray-950 border border-gray-800 p-3 h-64 overflow-auto">
      <div className="text-gray-400">
        {processingLog.map((line, i) => (
          <div key={i} className="mb-1">
            {line.startsWith('user') 
              ? <span className="text-green-500">{line}</span>
              : line}
          </div>
        ))}
        <div className="text-green-500 flex items-center gap-1 mt-4">
          user=&gt; <div className="w-2 h-4 bg-green-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
  
  const renderTokenView = () => (
    <div className="bg-gray-950 border border-gray-800 p-3 h-64 overflow-auto">
      <div className="flex flex-wrap">
        {tokens.map(token => (
          <div 
            key={token.id} 
            style={getTokenStyle(token)}
            onClick={() => setSelectedToken(token)}
            className={`transition-all ${selectedToken?.id === token.id ? 'ring-1 ring-white' : ''}`}
          >
            {token.text}
          </div>
        ))}
      </div>
      
      {selectedToken && (
        <div className="mt-4 p-2 border border-gray-700 bg-black">
          <div className="text-sm text-gray-300 mb-2">Token Analysis:</div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="text-gray-400">:text</div>
            <div className="text-white">"{selectedToken.text}"</div>
            
            <div className="text-gray-400">:length</div>
            <div className="text-white">{selectedToken.length}</div>
            
            <div className="text-gray-400">:vector</div>
            <div className="text-white">
              [{selectedToken.vector.map(v => v.toFixed(3)).join(' ')}]
            </div>
            
            <div className="text-gray-400">:sentiment</div>
            <div className="text-white">{selectedToken.sentiment.toFixed(3)}</div>
          </div>
        </div>
      )}
    </div>
  );
  
  const renderSentimentView = () => (
    <div className="bg-gray-950 border border-gray-800 p-3 h-64 flex flex-col items-center justify-center">
      <div 
        className="w-32 h-32 border rounded-full flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderColor: sentimentScore > 0 
            ? `rgba(255, 255, 255, ${Math.min(0.8, sentimentScore + 0.3)})`
            : `rgba(128, 128, 128, ${Math.min(0.6, Math.abs(sentimentScore) + 0.2)})`,
          boxShadow: `0 0 ${Math.abs(sentimentScore) * 30}px rgba(255, 255, 255, ${Math.abs(sentimentScore) * 0.3})`
        }}
      >
        <div className="text-center">
          <div className="text-2xl font-mono">{sentimentScore.toFixed(2)}</div>
          <div className="text-xs text-gray-400">sentiment</div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-400">
        (def result &#123;:score {sentimentScore.toFixed(2)}
                     :magnitude {Math.abs(sentimentScore).toFixed(2)}
                     :label {sentimentScore > 0.3 ? ":positive" : 
                             sentimentScore < -0.3 ? ":negative" : ":neutral"}&#125;)
      </div>
    </div>
  );
  
  const renderVectorView = () => (
    <div className="bg-gray-950 border border-gray-800 p-3 h-64 relative overflow-hidden">
      {/* Coordinate system */}
      <div className="absolute inset-0">
        <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-800"></div>
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gray-800"></div>
      </div>
      
      {/* Vector points (2D projection of first 2 dimensions) */}
      {tokens.map(token => (
        <div 
          key={token.id}
          className="absolute w-2 h-2 rounded-full cursor-pointer transition-all"
          style={{
            left: `${50 + token.vector[0] * 100}%`,
            top: `${50 + token.vector[1] * 100}%`,
            backgroundColor: `rgba(255, 255, 255, ${0.3 + Math.abs(token.sentiment || 0) * 0.7})`,
            transform: selectedToken?.id === token.id ? 'scale(2)' : 'scale(1)',
          }}
          onClick={() => setSelectedToken(token)}
        />
      ))}
      
      {/* Labels */}
      <div className="absolute bottom-1 right-2 text-xs text-gray-600">Vector Space Projection</div>
    </div>
  );
  
  const renderActiveView = () => {
    switch(activeTab) {
      case 'repl': return renderREPL();
      case 'tokens': return renderTokenView();
      case 'sentiment': return renderSentimentView();
      case 'vectors': return renderVectorView();
      default: return renderREPL();
    }
  };

  return (
    <div className="bg-black text-white font-mono p-4 rounded-none border border-gray-800">
      <h2 className="text-sm border-b border-gray-800 pb-2 mb-4 flex items-center gap-2">
        <Code size={16} className="text-gray-400" />
        <span className="text-gray-200">CLOJURE NLP ENVIRONMENT</span>
      </h2>
      
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-1">Input Text:</div>
        <textarea 
          className="w-full bg-gray-900 border border-gray-800 rounded p-2 text-white text-sm font-mono"
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>
      
      <div className="flex mb-3 gap-px text-xs">
        <button
          className={`px-3 py-1 flex items-center gap-1 ${activeTab === 'repl' ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-500'}`}
          onClick={() => setActiveTab('repl')}
        >
          <Play size={12} /> REPL
        </button>
        <button
          className={`px-3 py-1 flex items-center gap-1 ${activeTab === 'tokens' ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-500'}`}
          onClick={() => setActiveTab('tokens')}
        >
          <Hash size={12} /> TOKENS
        </button>
        <button
          className={`px-3 py-1 flex items-center gap-1 ${activeTab === 'sentiment' ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-500'}`}
          onClick={() => setActiveTab('sentiment')}
        >
          <Eye size={12} /> SENTIMENT
        </button>
        <button
          className={`px-3 py-1 flex items-center gap-1 ${activeTab === 'vectors' ? 'bg-gray-800 text-white' : 'bg-gray-900 text-gray-500'}`}
          onClick={() => setActiveTab('vectors')}
        >
          <GitBranch size={12} /> VECTORS
        </button>
      </div>
      
      {renderActiveView()}
      
      <div className="mt-4 text-xs text-gray-600 border-t border-gray-800 pt-2">
        <div className="flex items-center gap-1">
          <BookOpen size={12} />
          <span>Functional NLP processing: transformation of immutable data structures</span>
        </div>
      </div>
    </div>
  );
};

export default ClojureNLPPlayground;