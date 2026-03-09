import { Component, signal, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { MinecraftService } from './services/minecraft.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('minecraft');

  private svc = inject(MinecraftService);
  private platformId = inject(PLATFORM_ID);

  // ── Static data ──────────────────────────────────────────────────────────────
  modalities = this.svc.getModalities();
  features = this.svc.getFeatures();
  joinSteps = this.svc.getJoinSteps();
  faq = this.svc.getFAQ();

  // ── Reactive signals (bound from service) ───────────────────────────────────
  serverOnline = this.svc.serverOnline;
  playerCount = this.svc.playerCount;
  maxPlayers = this.svc.maxPlayers;
  serverVersion = this.svc.serverVersion;
  isLoading = this.svc.isLoading;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Fetch real server status on load
      this.svc.loadServerStatus();

      // Simulate live player fluctuation every 5 seconds
      setInterval(() => {
        const delta = Math.floor(Math.random() * 7) - 3; // −3 to +3
        this.svc.playerCount.update(count =>
          Math.max(0, Math.min(count + delta, this.svc.maxPlayers()))
        );
      }, 5000);
    }
  }
}
