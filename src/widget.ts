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
      coord: {}
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
  private _height: number = 250;
  // private _emailInput: HTMLInputElement;

  render() {

    this._smartBoard = new SmartBoard({ parent: this.el });

    this._svg = this._smartBoard.svg;

    this._svg.style.height = `${this._height}px`;

    this.el.classList.add('custom-widget');

    this.el.appendChild(this._svg);

    console.log(this._svg)

    this.model.on('change:value', this.value_changed, this);
    this.model.on('change:coord', this.value_changed, this);

    let coord: { [key: number]: number } = {};

    this._smartBoard.target.addEventListener('new_entity', (event: Event) => {

      console.log('new_entity');

      let entity = (event as CustomEvent).detail;

      let paths: Array<Array<number>> = entity.path;

      coord = paths.reduce((p, c) => {

        let y = this._height - c[1];

        if (!coord.hasOwnProperty(c[0]) || coord[c[0]] < y) {

          coord[c[0]] = y;
        }

        return coord;
      }, coord);

      this.model.set('coord', { ...coord });
      
      this.model.save_changes();
    });

    // this._emailInput = document.createElement('input');
    // this._emailInput.type = 'email';
    // this._emailInput.value = 'example@example.com';
    // this._emailInput.disabled = true;
    // this.el.appendChild(this._emailInput);

    // this.el.classList.add('custom-widget');

    // this.value_changed();

    // this.model.on('change:value', this.value_changed, this);
  }

  value_changed() {
    console.log('value', this.model.get('value'));
    console.log('coord', this.model.get('coord'));
    //this.el.textContent = this.model.get('value');
  }
}
