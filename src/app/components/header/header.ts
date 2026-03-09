import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private platformId = inject(PLATFORM_ID);

  copyServerIp() {
    if (isPlatformBrowser(this.platformId)) {
      const ip = 'mc.tuservidor.com';
      navigator.clipboard.writeText(ip).then(() => {
        alert('¡IP Copiada! Te esperamos en: ' + ip);
      }).catch(err => console.error('Error al copiar', err));
    }
  }
}
