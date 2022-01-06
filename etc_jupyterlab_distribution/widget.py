#!/usr/bin/env python
# coding: utf-8

# Copyright (c) ETC.
# Distributed under the terms of the Modified BSD License.

import logging
import sys
import traceback



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
from traitlets import Unicode, Bool, validate, TraitError, List
from traitlets.traitlets import Any, Dict, observe
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

    value = Any().tag(sync=True)

    paths = List().tag(sync=True)

    line = Dict({}).tag(sync=True)

    distribution = List().tag(sync=True)

    @observe('paths')
    def _valid_value(self, change):
        
        try:

            paths = self.paths

            paths = np.array(paths)

            xs = paths[:, 0]

            ys = paths[:, 1]

            x2s = range(xs.min(), xs.max()+1)

            y2s = np.interp(x2s, xs, ys)

            for index in range(0, len(x2s)):

                x = x2s[index]

                y = y2s[index]

                if x not in self.line or self.line[x] < y:
                    
                    self.line[x] = y

            x3s = np.array(list(self.line.keys())).astype(int)
            y3s = np.array(list(self.line.values())).astype(int)

            data = np.repeat(x3s, y3s)

            self.distribution = list(data)

            hist = np.histogram(data, bins=max(list(self.line.keys())))

            hist_dist = stats.rv_histogram(hist)

            self.value = hist_dist

            log.info(self.value)

        except Exception as e:

            if hasattr(e, 'message'):

                log.error(e.message)

            else:

                log.error(e)

            log.error(traceback.format_exc())


