#!/usr/bin/env python
# coding: utf-8

# Copyright (c) ETC.
# Distributed under the terms of the Modified BSD License.

import logging
import sys
import traceback
import os


log = logging.getLogger(__name__)
log.setLevel(logging.DEBUG)
map(log.removeHandler, list(log.handlers))
ch = logging.StreamHandler(sys.stdout)
ch.setLevel(logging.DEBUG)
# formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
formatter = logging.Formatter('%(levelname)s - %(message)s')
ch.setFormatter(formatter)
log.addHandler(ch)
fh = logging.FileHandler('widget.log')
fh.setLevel(logging.DEBUG)
log.addHandler(fh)

"""
TODO: Add module docstring
"""
from ipywidgets import DOMWidget, ValueWidget, register
from traitlets import Unicode, Bool, TraitError, List, All, Float, Any, Dict, Integer, observe, validate
from ._frontend import module_name, module_version
import numpy as np
from scipy.interpolate import splprep, splev
from scipy import stats

@register
class DistributionWidget(DOMWidget, ValueWidget):
    """TODO: Add docstring here
    """
    _model_name = Unicode('DistributionModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)

    _view_name = Unicode('DistributionView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    value = Any()
    histogram = Any().tag(sync=True)
    bins = Integer().tag(sync=True)

    entity_paths = List().tag(sync=True)
    distribution = List().tag(sync=True)

    width = Integer().tag(sync=True)
    height = Integer().tag(sync=True)

    x_min = Float(-1).tag(sync=True)
    x_max = Float(1).tag(sync=True)


    @observe('x_min', 'change')
    def _observe_x_min(self, change):
        self.update()

    @observe('x_max', 'change')
    def _observe_x_max(self, change):
        self.update()

    @observe('entity_paths', 'change')
    def _observe_entity_paths(self, change):
        self.update()
       
    def update(self):

        try:

            if len(self.entity_paths) > 0:

                dist_map = {}

                x_range = self.x_max - self.x_min

                for coords in self.entity_paths:

                    coords_x_min = None
                    coords_x_max = None
                    
                    _xs = []
                    _ys = []

                    coords = sorted(coords, key=lambda x: x['x'])
                    
                    for coord in coords:

                        if coords_x_min == None or coord['x'] < coords_x_min:

                            coords_x_min = coord['x']
                            # The min x and max x value are needed for interpolation; hence, extract both of the entity_paths.
                        if coords_x_max == None or coord['x'] > coords_x_max:

                            coords_x_max = coord['x']
                            
                        _xs.append(coord['x'])
                        _ys.append(coord['y'])
                    
                    xs = np.array(range(coords_x_min, coords_x_max + 1))

                    ys = np.interp(xs, _xs, _ys)
                    
                    for index in range(0, len(xs)):
                        
                        if xs[index] not in dist_map or ys[index] > dist_map[xs[index]]:
                            
                            dist_map[xs[index]] = ys[index]

                xs = np.array(list(dist_map.keys()))
                ys = np.array(list(dist_map.values()))

                ys = (self.height - ys).astype(int)

                self.bins = int((xs.max() - xs.min()) + 1)

                xs = ((xs / self.width) * x_range) + self.x_min
                # Convert from pixels to x_range units.

                self.distribution = list(np.repeat(xs, ys))

                self.histogram = np.histogram(self.distribution, bins=self.bins)

                self.value = stats.rv_histogram(self.histogram)

                # log.info(f'{dist_map}\n\n\n')

        except Exception as e:

            if hasattr(e, 'message'):

                log.error(e.message)

            else:

                log.error(e)

            log.error(traceback.format_exc())


