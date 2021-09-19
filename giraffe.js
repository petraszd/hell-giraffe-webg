var Giraffe = {
  //Attrs
  giraffe: null,
  shadow: null,
  carrots: [],
  carrotIndex: 0,

  carrotThrowed: 0,

  animInt: null,
  frame: 0,

  isMouthOpened: false,
  mouthIndexes: [
    24, 25, 26, 27, 28, 29, 63, 64, 65, 73, 74,
    75, 80, 81, 82, 570, 571, 572, 573, 574, 575
  ],
  mouthDeltas: [
    [3.725290298461914e-09, 0.0665055438876152, -0.2291189432144165],
    [3.725290298461914e-09, 0.0665055438876152, -0.2291189432144165],
    [4.656612873077393e-10, 0.05088995769619942, -0.24721598625183105],
    [0.0, 0.11044608801603317, -0.20411503314971924],
    [0.0, 0.11044608801603317, -0.20411503314971924],
    [1.7462298274040222e-10, 0.09483062475919724, -0.2222120761871338],
    [1.1641532182693481e-10, 0.020716186612844467, -0.08732295036315918],
    [0.0, 0.013086553663015366, -0.07869923114776611],
    [0.0, 0.013086553663015366, -0.07869923114776611],
    [4.0745362639427185e-10, 0.0009224350214935839, -0.14807307720184326],
    [0.0, 0.018511885777115822, -0.12949275970458984],
    [0.0, 0.018511885777115822, -0.12949275970458984],
    [4.0745362639427185e-10, -0.05851281061768532, -0.06023990735411644],
    [0.0, -0.03733110427856445, -0.040779829025268555],
    [0.0, -0.03733110427856445, -0.040779829025268555],
    [2.9103830456733704e-10, 0.05203830450773239, -0.17244160175323486],
    [0.0, 0.055197350680828094, -0.15942096710205078],
    [0.0, 0.055197350680828094, -0.15942096710205078],
    [4.656612873077393e-10, 0.017731299623847008, -0.2048710584640503],
    [0.0, 0.03440462797880173, -0.1865149736404419],
    [0.0, 0.03440462797880173, -0.1865149736404419]
  ],

  // Methods
  init: function (camera) {
    camera.target.position = Giraffe.giraffe.position;
    Giraffe.shadow.rotation = Giraffe.giraffe.rotation;
  },

  rotateLeft: function () {
    Giraffe.giraffe.rotation.y += OPTIONS.ROTATE_SPEED;
  },

  rotateRight: function () {
    Giraffe.giraffe.rotation.y -= OPTIONS.ROTATE_SPEED;
  },

  move: function () {
    var pos = Giraffe.giraffe.position;
    var rot = Giraffe.giraffe.rotation;

    var deltax = -Math.sin(rot.y) * OPTIONS.MOVE_SPEED;
    var deltaz = -Math.cos(rot.y) * OPTIONS.MOVE_SPEED;

    if (
        Math.abs(pos.x + deltax) > OPTIONS.CAGE_LIMITS ||
        Math.abs(pos.z + deltaz) > OPTIONS.CAGE_LIMITS
      ) {
      deltax *= -0.2;
      deltaz *= -0.2;
    }

    pos.z += deltaz;
    pos.x += deltax;

    Giraffe.shadow.position.x = pos.x;
    Giraffe.shadow.position.z = pos.z;
  },

  throwUp: function () {
    var g = Giraffe.giraffe;
    var c = Giraffe.carrots[Giraffe.carrotIndex++];
    if (!c) {
      Giraffe.carrotIndex = 0;
      c = Giraffe.carrots[0];
    }
    if(c.intId) {
      clearInterval(c.intId);
    }

    var relx = -Math.sin(g.rotation.y);
    var relz = -Math.cos(g.rotation.y);

    c.position.x = g.position.x + relx * 1.55;
    c.position.y = g.position.y + 1.5;
    c.position.z = g.position.z + relz * 1.55;
    c.rotation.x = Math.random() * 0.5;
    c.rotation.z = Math.random() * 0.5;
    c.relx = relx * 0.4;
    c.relz = relz * 0.4;
    c.visible = true;

    Giraffe.makeCarrotGoDown(c);

    // Mouth logic
    Giraffe.openMouth();
    setTimeout(Giraffe.closeMouth, OPTIONS.MOUTH_OPEN_TIME);
  },

  makeCarrotGoDown: function (carrot) {
    carrot.intId = setInterval(function () {
      carrot.position.y -= 0.3;
      carrot.position.x += carrot.relx;
      carrot.position.z += carrot.relz;
      carrot.relx *= carrot.relx * 1.9;
      carrot.relz *= carrot.relz * 1.9;
      if (carrot.position.y <= -3.5) {
        clearInterval(carrot.intId);
        carrot.intId = null;
        carrot.visible = false;
        Giraffe.carrotThrowed++;
        Giraffe.writeCount();
      }
    }, OPTIONS.RENDER_INTERVAL);
  },

  throwedUpEnougth: function () {
    return Giraffe.carrotThrowed >= OPTIONS.TO_WIN;
  },

  animOn: function () {
    if (Giraffe.animInt) {
      return;
    }
    Giraffe.animInt = setInterval(function () {
      Giraffe.frame++;
      if (Giraffe.frame >= AnimData.length) {
        Giraffe.frame = 0;
      }
      Giraffe.repose();
    }, OPTIONS.RENDER_INTERVAL);
  },

  animOff: function () {
    if (Giraffe.animInt) {
      clearInterval(Giraffe.animInt);
    }
    Giraffe.frame = 0;
    Giraffe.repose();
    Giraffe.animInt = null;
  },

  repose: function () {
    var geom = Giraffe.giraffe.geometry;
    var verts = geom.vertices;

    var frame = AnimData[Giraffe.frame];
    for (var i = 0; i < frame.length; ++i) {
      verts[i].position.set.apply(verts[i].position, frame[i]);
    }
    geom.__dirtyVertices = true;
    if (Giraffe.isMouthOpened) {
      Giraffe.openMouth();
    }
  },

  openMouth: function () {
    var geom = Giraffe.giraffe.geometry;
    var verts = geom.vertices;

    var indexes = Giraffe.mouthIndexes;
    var deltas = Giraffe.mouthDeltas;
    for (var i = 0; i < indexes.length; ++i) {
      var pos = verts[indexes[i]].position;
      pos.x -= deltas[i][0];
      pos.y -= deltas[i][1];
      pos.z -= deltas[i][2];
    }

    Giraffe.isMouthOpened = true;
    geom.__dirtyVertices = true;
  },

  closeMouth: function () {
    Giraffe.isMouthOpened = false;
    if (!Giraffe.animInt) {
      Giraffe.repose();
    }
  },

  resetCounter: function () {
    Giraffe.carrotThrowed = 0;
    Giraffe.writeCount();
  },

  writeCount: function () {
    var count = Math.min(OPTIONS.TO_WIN, Giraffe.carrotThrowed);
    var total = OPTIONS.TO_WIN;
    var text = '' + count + ' / ' + total;
    document.getElementById('score').innerHTML = text;
  }
};

