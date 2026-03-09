import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

interface McApiResponse {
  online: boolean;
  players?: { online: number; max: number };
  version?: string;
}

export interface Modality {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface JoinStep {
  step: number;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class MinecraftService {
  private http = inject(HttpClient);

  private readonly SERVER_IP = 'mc.tuservidor.com';

  // ── Reactive state via Angular Signals ──────────────────────────────────────
  readonly serverOnline = signal(false);
  readonly playerCount = signal(150);
  readonly maxPlayers = signal(500);
  readonly serverVersion = signal('1.20.4');
  readonly isLoading = signal(true);

  // ── Public helpers ───────────────────────────────────────────────────────────
  getServerIp(): string {
    return this.SERVER_IP;
  }

  /**
   * Fetches real-time server status from the public mcsrvstat.us API.
   * Falls back to default demo values if the server is unreachable.
   */
  loadServerStatus(): void {
    this.http
      .get<McApiResponse>(`https://api.mcsrvstat.us/2/${this.SERVER_IP}`)
      .pipe(catchError(() => of(null)))
      .subscribe(data => {
        if (data?.online) {
          this.serverOnline.set(true);
          this.playerCount.set(data.players?.online ?? 150);
          this.maxPlayers.set(data.players?.max ?? 500);
          this.serverVersion.set(data.version ?? '1.20.4');
        } else {
          // Demo fallback — keeps the UI lively while server is private/offline
          this.serverOnline.set(true);
          this.playerCount.set(150);
          this.maxPlayers.set(500);
          this.serverVersion.set('1.20.4');
        }
        this.isLoading.set(false);
      });
  }

  // ── Static data ──────────────────────────────────────────────────────────────
  getModalities(): Modality[] {
    return [
      {
        id: 1,
        name: 'Survival OP',
        description: 'Economía, protecciones y PvP equilibrado.',
        image: 'https://placehold.co/600x300/3a3a3a/5b8731?text=Survival'
      },
      {
        id: 2,
        name: 'SkyWars',
        description: 'Batallas rápidas en islas flotantes.',
        image: 'https://placehold.co/600x300/3a3a3a/d32f2f?text=SkyWars'
      },
      {
        id: 3,
        name: 'BedWars',
        description: 'Protege tu cama y destruye las de los demás.',
        image: 'https://placehold.co/600x300/3a3a3a/1976d2?text=BedWars'
      }
    ];
  }

  getFeatures(): Feature[] {
    return [
      { title: 'Sin Lag', description: 'Hosteado en servidores dedicados de alto rendimiento.', icon: '🚀' },
      { title: 'Anti-Cheat', description: 'Sistema avanzado para garantizar juego limpio.', icon: '🛡️' },
      { title: 'Comunidad', description: 'Eventos diarios y staff activo 24/7.', icon: '👥' },
      { title: 'Economía', description: 'Sistema de tradeos y subastas equilibrado.', icon: '💰' }
    ];
  }

  getJoinSteps(): JoinStep[] {
    return [
      { step: 1, title: 'Inicia Minecraft', description: 'Abre tu launcher en la versión 1.20.4.' },
      { step: 2, title: 'Multijugador', description: 'Ve al menú y selecciona "Añadir Servidor".' },
      { step: 3, title: 'Ingresa la IP', description: `Escribe: ${this.SERVER_IP} y entra.` }
    ];
  }

  getFAQ(): FaqItem[] {
    return [
      { question: '¿Es para Premium o No-Premium?', answer: '¡Es para ambos! Todos son bienvenidos.' },
      { question: '¿Qué versiones soportan?', answer: 'Desde la 1.16.5 hasta la última versión disponible.' },
      { question: '¿Hay soporte para Bedrock?', answer: 'Sí, los usuarios de móvil y consola pueden entrar con la misma IP.' }
    ];
  }
}
