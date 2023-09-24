import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-markdown-display',
  templateUrl: './markdown-display.component.html',
  styleUrls: ['./markdown-display.component.scss']
})
export class MarkdownDisplayComponent implements OnInit {
  markdownUrl: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Subscribe to changes in route parameters using paramMap observable
    this.route.paramMap.subscribe((params: ParamMap) => {
      const folder = params.get('folder');
      const filename = params.get('filename');
      const newFilename = filename?.replace(/%20/g, ' ');

      if (folder && newFilename) {
        this.markdownUrl = `/content/md/${folder}/${newFilename}.md`;
      }
    });
  }

}
