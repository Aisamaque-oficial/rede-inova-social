import React from 'react';
import { createRoot } from 'react-dom/client';
import { AccessibilityToolbar } from '../components/accessibility-toolbar';
import '../app/globals.css';

import { AccessibilityProvider } from '../context/accessibility-context';

// Função auxiliar para converter HEX em HSL (para variáveis do Tailwind se o usuário quiser mudar a cor)
function hexToHsl(hex: string): string {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

class AccessibilityElement extends HTMLElement {
  connectedCallback() {
    // Evita inicialização dupla
    if (this.hasChildNodes()) return;

    const mountPoint = document.createElement('div');
    this.appendChild(mountPoint);

    // Lendo configurações personalizadas da tag <acessibilidade>
    const customColor = this.getAttribute('cor-principal');
    const positionAttr = this.getAttribute('posicao');
    const position = positionAttr === 'esquerda' ? 'left' : 'right';
    
    if (customColor) {
      // Aplica a cor customizada na raiz do documento para sobrescrever as variáveis do tailwind
      const hslColor = hexToHsl(customColor);
      document.documentElement.style.setProperty('--primary', hslColor);
    }

    const root = createRoot(mountPoint);
    root.render(
        <React.StrictMode>
            <AccessibilityProvider>
                <div className="rede-inova-widget-container">
                    <AccessibilityToolbar position={position} />
                </div>
            </AccessibilityProvider>
        </React.StrictMode>
    );
  }
}

// Registrando a tag <mt-acessibilidade>
if (typeof window !== 'undefined' && !customElements.get('mt-acessibilidade')) {
  customElements.define('mt-acessibilidade', AccessibilityElement);
}
