"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [extractingProgress, setExtractingProgress] = useState(false);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError("");
    setImages([]);
    setExtractingProgress(true);

    try {
      const response = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to extract images");
      }
      
      if (data.images && data.images.length > 0) {
        setImages(data.images);
      } else {
        throw new Error("No images found in this post");
      }
    } catch (err: any) {
      setError(err.message || "Failed to extract images");
    } finally {
      setLoading(false);
      setExtractingProgress(false);
    }
  };

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `instagram-pic-${index + 1}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Download failed", e);
      alert("Failed to download image. Please try again.");
    }
  };

  return (
    <main className="container">
      <div className="header-section glass-panel animate-fade-in">
        <h1 className="title text-gradient">InstaPic Downloader</h1>
        <p className="subtitle">Download high-quality photos from Instagram posts instantly.</p>
        
        <form onSubmit={handleExtract} className="search-form">
          <input
            type="text"
            className="search-input glass-panel"
            placeholder="Paste Instagram Post URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit" className="extract-btn" disabled={loading}>
            {loading ? <span className="loader"></span> : "Extract"}
          </button>
        </form>
        {error && <div className="error-message animate-fade-in">{error}</div>}
      </div>

      {extractingProgress && (
        <div className="progress-container animate-fade-in">
          <p>Extracting images...</p>
        </div>
      )}

      {images.length > 0 && (
        <div className="results-container animate-fade-in">
          <h2 className="results-title">Extracted Photos ({images.length})</h2>
          <div className="images-grid">
            {images.map((img, idx) => (
              <div key={idx} className="image-card glass-panel" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="image-wrapper">
                  <img src={img} alt={`Extracted ${idx + 1}`} className="extracted-img" />
                </div>
                <button 
                  className="download-btn"
                  onClick={() => handleDownload(img, idx)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download HD
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
