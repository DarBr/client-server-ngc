import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class CustomReuseStrategy implements RouteReuseStrategy {
  handlers: { [key: string]: DetachedRouteHandle } = {};

  // Entscheidet, ob eine Route wiederverwendbar ist
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Exclude the 'login' and 'register' routes
    if (route.routeConfig!.path === 'login' || route.routeConfig!.path === '' || route.routeConfig!.path === 'transaktion-liste' || route.routeConfig!.path === 'kaufen') {
      return false;
    }
    return true; // Du kannst hier eine Bedingung hinzufügen, um bestimmte Routen auszuschließen
  }

  // Speichert die Route, wenn sie verlassen wird
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    this.handlers[route.routeConfig!.path!] = handle;
  }

  // Entscheidet, ob eine gespeicherte Route bei der Navigation wiederhergestellt werden soll
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig && !!this.handlers[route.routeConfig.path!];
  }

  // Holt die gespeicherte Route, wenn eine Route wieder angezeigt werden soll
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.routeConfig || route.routeConfig.loadChildren) {
      return null;
    }
    return this.handlers[route.routeConfig.path!];
  }

  // Entscheidet, ob eine Route im neuen Zustand instanziiert werden soll
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}

