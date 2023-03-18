import {
  DestroyRef,
  effect,
  inject,
  SettableSignal,
  signal,
  Signal,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';

export const fromObservable = <T>(
  obs$: Observable<T>,
  initialValue?: T
): SettableSignal<T> => {
  const s = signal(initialValue as T);
  const destroyRef = inject(DestroyRef);
  const destroy$ = new Subject<void>();
  destroyRef.onDestroy(() => {
    destroy$.next();
  });
  obs$.pipe(takeUntil(destroy$)).subscribe((v) => {
    s.set(v);
  });
  return s;
};

export const fromSignal = <T>(sig: Signal<T>): Observable<T> => {
  const destroyRef = inject(DestroyRef);

  return new Observable<T>((observer) => {
    const disposer = effect(() => {
      observer.next(sig());
    });

    destroyRef.onDestroy(disposer.destroy);
  });
};

export const registerRxEffect = <T>(
  obs$: Observable<T>,
  effectFn: (x: T) => void
) => {
  const destroyRef = inject(DestroyRef);
  const destroy$ = new Subject<void>();
  destroyRef.onDestroy(() => {
    destroy$.next();
  });
  obs$.pipe(takeUntil(destroy$)).subscribe(effectFn);
};

export const connect = <T>(signal: SettableSignal<T>, obs$: Observable<T>) => {
  const destroyRef = inject(DestroyRef);
  const destroy$ = new Subject<void>();
  destroyRef.onDestroy(() => {
    destroy$.next();
  });
  obs$.pipe(takeUntil(destroy$)).subscribe({
    next: signal.set,
  });
};
