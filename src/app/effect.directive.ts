import {
  DestroyRef,
  Directive,
  effect,
  EmbeddedViewRef,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[effect]',
})
export class EffectDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private destroyRef: DestroyRef
  ) {
    const view = vcr.createEmbeddedView(this.templateRef);

    const disposer = effect(() => {
      view.detectChanges();
    });

    setTimeout(() => {
      // destroyRef.onDestroy(disposer.destroy)
    });
  }
}
