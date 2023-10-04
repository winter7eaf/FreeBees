import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'jhi-style',
  templateUrl: './style.component.html',
  styleUrls: ['./style.component.scss'],
})
export class StyleComponent implements OnInit {
  isDarkMode = false;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {}

  switchTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-theme');
    } else {
      this.renderer.removeClass(document.body, 'dark-theme');
    }
  }
}
