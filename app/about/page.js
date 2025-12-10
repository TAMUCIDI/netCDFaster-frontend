"use client";

import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    {/* Main Content */}
    <div className="max-w-5xl mx-auto px-6 pt-8 pb-8">
      {/* Header with Logo */}
      <div className="flex justify-center pb-4">
        <Image
          src="/logo_transparent.png"
          width={300}
          height={300}
          alt="NetCDFaster Logo"
        />
      </div>

      {/* Content with DaisyUI Typography */}
      <div className="max-w-4xl mx-auto">
      <article className="prose prose-lg dark:prose-invert mx-auto">

        {/* Title */}
        <h1 className="text-center">About</h1>

        <div className="divider"></div>
        {/* Paper Citation Section */}
        <h2>Citation</h2>
        <div className="not-prose">
          <div className="mockup-code bg-base-200 text-base-content">
            <pre className="whitespace-pre-wrap break-words pl-4"><code>Song, Z., Zhang, Z., Sussman, A., Xie, Y., Brenner, J., & Liu, J. (2025). NetCDFaster: Optimizing NetCDF data querying and geo-visualization using high-performance machine learning. SoftwareX, 31, 102269. https://doi.org/10.1016/j.softx.2025.102269</code></pre>
          </div>
        </div>
      {/* GitHub Link Section */}
      <h2>GitHub Repo</h2>
      <p>
      NetCDFaster is open-source and available on GitHub.
      </p>
      <div className="not-prose flex flex-wrap gap-4 mt-4">
        <a
          href="https://github.com/TAMUCIDI/netCDFaster-frontend"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-primary gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          Frontend
        </a>
        <a
          href="https://github.com/TAMUCIDI/netCDFaster-backend"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-primary gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          Backend
        </a>
      </div>

      {/* Acknowledgments */}
      <h2>Acknowledgment</h2>
      <p>
      This is funded by the National Science Foundation (NSF) under Grant No. #2339174 #2526748 # 2519476 # 2321069 # 2112356.
      </p>

      {/* Logos Section */}
      <div className="not-prose my-8">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          <div className="flex items-center justify-center">
            <Image
              src="/NSF_logo.svg"
              width={150}
              height={150}
              alt="National Science Foundation Logo"
              className="object-contain"
            />
          </div>
          <div className="flex items-center justify-center">
            <Image
              src="/RBG-TAM-MaroonBox.svg"
              width={150}
              height={150}
              alt="Texas A&M University Logo"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* Footer */}
      <div className="text-center text-sm opacity-70">
        <p>© 2024 TAMU CIDI Lab.</p>
        <p>Licensed under MIT License</p>
      </div>

      </article>
      </div>
    </div>
  </div>
);
}
