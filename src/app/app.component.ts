import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  json1: string = '';
  json2: string = '';
  comparisonMode: string = 'keys'; // Default: compare keys
  diff1: string[] = [];
  diff2: string[] = [];

  @ViewChild('inputBox1') inputBox1!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('inputBox2') inputBox2!: ElementRef<HTMLTextAreaElement>;

  // Synchronize dimensions of the input boxes
  syncDimensions() {
    const box1 = this.inputBox1.nativeElement;
    const box2 = this.inputBox2.nativeElement;

    // Match height
    const maxHeight = Math.max(box1.scrollHeight, box2.scrollHeight);
    box1.style.height = `${maxHeight}px`;
    box2.style.height = `${maxHeight}px`;

    // Match width
    const maxWidth = Math.max(box1.offsetWidth, box2.offsetWidth);
    box1.style.width = `${maxWidth}px`;
    box2.style.width = `${maxWidth}px`;
  }

  // Extract all keys recursively
  extractKeys(data: any, prefix: string = ''): Set<string> {
    const keys = new Set<string>();
    for (const key in data) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      keys.add(fullKey);
      if (typeof data[key] === 'object' && data[key] !== null) {
        const nestedKeys = this.extractKeys(data[key], fullKey);
        nestedKeys.forEach(k => keys.add(k));
      }
    }
    return keys;
  }

  // Extract all key-value pairs recursively
  extractKeyValues(data: any, prefix: string = ''): Map<string, any> {
    const keyValues = new Map<string, any>();
    for (const key in data) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof data[key] === 'object' && data[key] !== null) {
        const nestedKeyValues = this.extractKeyValues(data[key], fullKey);
        nestedKeyValues.forEach((v, k) => keyValues.set(k, v));
      } else {
        keyValues.set(fullKey, data[key]);
      }
    }
    return keyValues;
  }

  // Compare JSONs based on the selected mode
  compareJsons() {
    try {
      const obj1 = JSON.parse(this.json1);
      const obj2 = JSON.parse(this.json2);

      if (this.comparisonMode === 'keys') {
        const keys1 = this.extractKeys(obj1);
        const keys2 = this.extractKeys(obj2);

        this.diff1 = Array.from(keys1).filter(key => !keys2.has(key));
        this.diff2 = Array.from(keys2).filter(key => !keys1.has(key));
      } else if (this.comparisonMode === 'values') {
        const keyValues1 = this.extractKeyValues(obj1);
        const keyValues2 = this.extractKeyValues(obj2);

        this.diff1 = Array.from(keyValues1.keys()).filter(key => keyValues1.get(key) !== keyValues2.get(key));
        this.diff2 = Array.from(keyValues2.keys()).filter(key => keyValues1.get(key) !== keyValues2.get(key));
      } else if (this.comparisonMode === 'both') {
        const keys1 = this.extractKeys(obj1);
        const keys2 = this.extractKeys(obj2);

        const keyValues1 = this.extractKeyValues(obj1);
        const keyValues2 = this.extractKeyValues(obj2);

        const keyDiff1 = Array.from(keys1).filter(key => !keys2.has(key));
        const keyDiff2 = Array.from(keys2).filter(key => !keys1.has(key));

        const valueDiff1 = Array.from(keyValues1.keys()).filter(key => keyValues1.get(key) !== keyValues2.get(key));
        const valueDiff2 = Array.from(keyValues2.keys()).filter(key => keyValues1.get(key) !== keyValues2.get(key));

        this.diff1 = [...keyDiff1, ...valueDiff1];
        this.diff2 = [...keyDiff2, ...valueDiff2];
      }
    } catch (error) {
      alert('Invalid JSON input.');
    }
  }

  // Copy content to clipboard
  copyContent(content: string) {
    navigator.clipboard.writeText(content).then(
      () => {},
      (err) => alert('Failed to copy content.')
    );
  }

}
