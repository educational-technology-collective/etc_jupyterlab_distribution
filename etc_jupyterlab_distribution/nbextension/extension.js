// Entry point for the notebook bundle containing custom model definitions.
//
define(function() {
    "use strict";

    window['requirejs'].config({
        map: {
            '*': {
                '@educational-technology-collective/etc_jupyterlab_distribution': 'nbextensions/etc_jupyterlab_distribution/index',
            },
        }
    });
    // Export the required load_ipython_extension function
    return {
        load_ipython_extension : function() {}
    };
});