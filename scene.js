var SceneManager = {
  // Attrs
  W: 800,
  H: 600,
  renderer: null,
  camera: null,
  scene: null,

  // Methods
  init: function() {
    SceneManager.initCamera();
    SceneManager.initScene();
    SceneManager.initRenderer();

    SceneManager.createScene();
    SceneManager.startGame();
  },

  initRenderer: function() {
    var r =  new THREE.WebGLRenderer();
    r.setSize(SceneManager.W, SceneManager.H);
    document.getElementById('container').appendChild(r.domElement);
    SceneManager.renderer = r;
  },

  initCamera: function() {
    var ratio = SceneManager.W / SceneManager.H;
    var c = new THREE.Camera(60.0, ratio, 1.0, 10000.0);
    c.position.z = -8;
    c.position.x = 4;
    c.position.y = 2;

    SceneManager.camera = c;
  },

  initScene: function() {
    var s = new THREE.Scene();
    SceneManager.scene = s;
  },

  createScene: function () {
    var addMesh = SceneManager.addMesh;

    addMesh('ground', 0, -3.9, 0);
    Giraffe.shadow = addMesh('shadow', 0, -2.3, 0.0);
    Giraffe.giraffe = addMesh('giraffe', 0, 0.2, 0);
    Giraffe.init(SceneManager.camera);
    Giraffe.repose();

    for (var i = 0; i < OPTIONS.CARROT_COUNT; ++i) {
      var c = addMesh('carrot', 0, 0, 0);
      c.visible = false;
      Giraffe.carrots.push(c);
    }
  },

  addMesh: function (name, x, y, z) {
    var material = new THREE.MeshBasicMaterial({
      map: ResourceManager.textures[name]
    });

    var geometry = ResourceManager.geometries[name];
    return SceneUtils.addMesh(
      SceneManager.scene, geometry, 1, x, y, z, 0, 0, 0, material
    );
  },

  mainLoop: function() {
    SceneManager.renderer.render(SceneManager.scene, SceneManager.camera);
    if (Giraffe.throwedUpEnougth()) {
      IO.resetEvents();

      IO.enter = SceneManager.startGame;

      Giraffe.animOff();
      document.getElementById('congrat').style.display = 'block';
    }
  },

  startGame: function () {
    IO.enter = function () {};

    IO.left = Giraffe.rotateLeft;
    IO.right = Giraffe.rotateRight;
    IO.up = Giraffe.move;
    IO.upStart = Giraffe.animOn;
    IO.upEnd = Giraffe.animOff;
    IO.action = Giraffe.throwUp;
    document.getElementById('congrat').style.display = 'none';
    Giraffe.resetCounter();
  }
};
