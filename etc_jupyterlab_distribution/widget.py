#!/usr/bin/env python
# coding: utf-8

# Copyright (c) ETC.
# Distributed under the terms of the Modified BSD License.

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

    coord = Dict().tag(sync=True)

    @validate('coord')
    def _valid_value(self, proposal):

        X = np.array([int(key) for key in proposal.value.keys()])

        Y = np.array([int(key) for key in proposal.value.values()])

        pts = np.vstack((X, Y))

        tck, u = splprep(pts, s=0.0)

        u_new = np.linspace(u.min(), u.max(), 10000)

        x, y = splev(u_new, tck)

        data = np.repeat(x, np.ceil(y).astype(int))

        hist = np.histogram(data, bins=5)

        hist_dist = stats.rv_histogram(hist)

        self.value = hist_dist

        return proposal['value']

