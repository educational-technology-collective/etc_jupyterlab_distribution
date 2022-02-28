// Copyright (c) ETC
// Distributed under the terms of the Modified BSD License.

import { SmartBoard } from '@educational-technology-collective/etc_smartboard';

import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers,
} from '@jupyter-widgets/base';

import { MODULE_NAME, MODULE_VERSION } from './version';

// Import the CSS
import '../css/widget.css';

class Axis {

  public node: HTMLElement;

  private minTickLabel: HTMLElement;
  private maxTickLabel: HTMLElement;

  constructor({
    dimension,
    xMin = -1,
    xMax = 1
  }: {
    dimension: number,
    xMin: number,
    xMax: number
  }) {

    this.node = document.createElement('div');
    this.node.style.width = dimension.toString() + 'px';
    this.node.classList.add('axis');

    this.minTickLabel = document.createElement('div');
    this.minTickLabel.innerHTML = xMin.toString();

    this.maxTickLabel = document.createElement('div');
    this.maxTickLabel.innerHTML = xMax.toString();

    this.node.appendChild(this.minTickLabel);
    this.node.appendChild(this.maxTickLabel);
  }

  updateMin(value: number) {

    this.minTickLabel.innerHTML = value.toString();
  }

  updateMax(value: number) {

    this.maxTickLabel.innerHTML = value.toString();
  }
}

export class DistributionModel extends DOMWidgetModel {

  defaults() {

    return {
      ...super.defaults(),
      _model_name: DistributionModel.model_name,
      _model_module: DistributionModel.model_module,
      _model_module_version: DistributionModel.model_module_version,
      _view_name: DistributionModel.view_name,
      _view_module: DistributionModel.view_module,
      _view_module_version: DistributionModel.view_module_version,
      value: null,
      entity_paths: [],
      distribution: []
    };
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers,
    // Add any extra serializers here
  };

  static model_name = 'DistributionModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'DistributionView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
}

export class DistributionView extends DOMWidgetView {

  private _svg: SVGElement;
  private _smartBoard: SmartBoard;
  private _height: number = 350;
  private _width: number = 450;

  render() {

    this.el.classList.add('distribution-widget');

    let container = document.createElement('div');
    container.classList.add('container')

    let inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');

    let xMin = -1;
    let xMinInput = document.createElement('input');
    xMinInput.setAttribute('value', xMin.toString());
    this.model.set('x_min', xMin).save_changes();

    let xMax = 1;
    let xMaxInput = document.createElement('input');
    xMaxInput.setAttribute('value', xMax.toString());
    this.model.set('x_max', xMax).save_changes();

    inputContainer.appendChild(xMinInput);
    inputContainer.appendChild(xMaxInput);

    this._smartBoard = new SmartBoard({ parent: this.el });

    this._svg = this._smartBoard.svg;

    this._svg.style.height = `${this._height}px`;
    this._svg.style.width = `${this._width}px`;
    
    container.appendChild(this._svg);
    container.appendChild(inputContainer);

    this.el.appendChild(container);

    this.model.set('width', this._width).save_changes();
    this.model.set('height', this._height).save_changes();

    let xAxis = new Axis({ dimension: this._width, xMin, xMax });

    this.el.appendChild(xAxis.node);

    xMinInput.addEventListener('input', (event: Event) => {

      xMin = parseFloat((<HTMLInputElement>event.target).value);

      if (!Number.isNaN(xMin) && xMin < xMax) {

        this.model.set('x_min', xMin).save_changes();

        xAxis.updateMin(xMin);

        xMinInput.classList.remove('invalid');
      }
      else {

        xMinInput.classList.add('invalid');
      }
    });

    xMaxInput.addEventListener('input', (event: Event) => {

      xMax = parseFloat((<HTMLInputElement>event.target).value);

      if (!Number.isNaN(xMax) && xMin < xMax) {

        this.model.set('x_max', xMax).save_changes();

        xAxis.updateMax(xMax);

        xMaxInput.classList.remove('invalid');
      }
      else {

        xMaxInput.classList.add('invalid');
      }
    });

    this._smartBoard.target.addEventListener('drawing_changed', (event: Event) => {

      let entities = (<CustomEvent>event).detail;

      let entity_paths = [];

      for (let entity of entities) {

        if (entity.parts.every((part: any) => part.hasOwnProperty('x') && part.hasOwnProperty('y'))) {

          entity_paths.push([...entity.parts]);
        }
      }

      this.model.unset('entity_paths');

      this.model.set('entity_paths', entity_paths).save_changes();
    });
  }
}



// this.model.on('change:entity_paths', this.entityPathsChanged, this);
// this.model.on('change:distribution', this.distributionChanged, this);


// entityPathsChanged() {
//   console.log('entityPathsChanged');
//   // console.log('entity_paths', this.model.get('entity_paths'));
// }

// distributionChanged() {
//   console.log('distributionChanged');
//   // console.log('distribution', this.model.get('distribution'));
// }