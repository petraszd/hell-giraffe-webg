var ResourceManager = {
  // Attrs
  textures: {},
  geometries: {},

  // Events
  onStart: function () {},
  onEnd: function () {},

  // Methods
  load: function (texturesSrcs, geometriesSrcs) {
    ResourceManager.onStart();

    var total = texturesSrcs.length + geometriesSrcs.length;
    var loaded = 0;

    var oneLoaded = function () {
      loaded++;
      if (total == loaded) {
        ResourceManager.onEnd();
      }
    }

    // Images
    for (var i = 0, name; name = texturesSrcs[i]; ++i) {
      var src = 'textures/' + name;
      var tex = ImageUtils.loadTexture(src, null, oneLoaded);
      ResourceManager.textures[ResourceManager.removeExtension(name)] = tex;
    }

    // Geom
    var loader = new THREE.Loader(true);
    for (var i = 0, name; name = geometriesSrcs[i]; ++i) {
      var callback = (function (name) {
        return function (geom) {
          ResourceManager.geometries[name] = geom;
          oneLoaded();
        };
      })(name);
      var src = 'obj/' + name + '.js';
      loader.loadAscii({model: src, callback: callback});
    }
  },

  removeExtension: function (filename) {
    return filename.substr(0, filename.lastIndexOf('.'));
  }
};
