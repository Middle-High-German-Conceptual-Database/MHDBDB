import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-markdown-display',
  templateUrl: './markdown-display.component.html'
})
export class MarkdownDisplayComponent implements OnInit {
  markdownUrl: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const filename = this.route.snapshot.params.filename;
    this.markdownUrl = `/content/md/${filename}.md`;
  }
}
