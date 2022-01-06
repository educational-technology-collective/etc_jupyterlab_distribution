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
      paths: [],
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

    this.model.on('change:paths', this.pathsChanged, this);
    this.model.on('change:distribution', this.distributionChanged, this);


    this._smartBoard.target.addEventListener('new_entity', (event: Event) => {

      console.log('new_entity');

      let entity = (event as CustomEvent).detail;

      let paths: Array<Array<number>> = entity.path;

      for (let path of paths) {
        path[1] = this._height - path[1];
      }

      this.model.set('paths', [...paths]);

      this.model.save_changes();
    });
  }

  pathsChanged() {
    console.log('paths', this.model.get('paths'));
  }

  distributionChanged() {
    console.log('distribution', this.model.get('distribution'));
  }
}
