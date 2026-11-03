'use client';

import React from 'react';

export default function HomePage() {
  return (
    <iframe
      src="/index.html"
      title="FoundHub"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        zIndex: 999999,
      }}
    />
  );
}
