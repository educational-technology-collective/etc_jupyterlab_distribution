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
  // private _emailInput: HTMLInputElement;

  render() {

    this._smartBoard = new SmartBoard({ parent: this.el });

    this._svg = this._smartBoard.svg;

    this._svg.style.height = `${this._height}px`;
    this._svg.style.width = `${this._width}px`;

    this.el.classList.add('distribution-widget');

    this.el.appendChild(this._svg);

    this.model.on('change:entity_paths', this.entityPathsChanged, this);
    this.model.on('change:distribution', this.distributionChanged, this);

    this._smartBoard.target.addEventListener('drawing_changed', (event: Event) => {

      console.log('drawing_changed');

      let entities = (event as CustomEvent).detail;

      let entity_paths = [];

      for (let entity of entities) {

        if (entity.parts.every((part: any) => part.hasOwnProperty('x') && part.hasOwnProperty('y'))) {

          entity_paths.push(entity.parts);
        }
      }

      this.model.set('entity_paths', entity_paths);

      this.model.save_changes();
    });
  }

  entityPathsChanged() {
    console.log('entity_paths', this.model.get('entity_paths'));
  }

  distributionChanged() {
    console.log('distribution', this.model.get('distribution'));
  }
}


// if (part.x < this.model.get('coord_xmin')) {

//   this.model.set('coord_xmin', part.x);

//   this.model.save_changes();
// }
// else if (part.x > this.model.get('coord_xmax')) {

//   this.model.set('coord_xmax', part.x);

//   this.model.save_changes();
// }

// if (part.y < this.model.get('coord_ymin')) {

//   this.model.set('coord_ymin', part.y);

//   this.model.save_changes();
// }
// else if (part.y > this.model.get('coord_ymax')) {

//   this.model.set('coord_ymax', part.y);

//   this.model.save_changes();
// }