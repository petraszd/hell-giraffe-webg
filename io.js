var IO = {
  // Events
  action: function () {},
  enter: function () {},

  left: function () {},
  right: function () {},
  up: function () {},
  down: function () {},

  leftStart: function () {},
  leftEnd: function () {},
  rightStart: function () {},
  rightEnd: function () {},
  upStart: function () {},
  upEnd: function () {},
  downStart: function () {},
  downEnd: function () {},


  // Attrs
  intLeft: null,
  intRight: null,
  intUp: null,
  intDown: null,
  allowAction: true,

  // Methods
  init: function () {
    document.addEventListener('keydown', IO.keyPressed, false);
    document.addEventListener('keyup', IO.keyReleased, false);
  },

  keyPressed: function (e) {
    var code = e.keyCode;
    switch (code) {
      case 37:
      case 65:
        IO.leftPressed();
      break;

      case 39:
      case 68:
        IO.rightPressed();
      break;

      case 38:
      case 87:
        IO.upPressed();
      break;

      case 40:
      case 83:
        IO.downPressed();
      break;

      case 32:
        IO.actionPressed();
      break;

      default:
      return
    }
    e.preventDefault();
  },

  keyReleased: function (e) {
    var code = e.keyCode;
    switch (code) {
      case 37:
      case 65:
        IO.leftReleased();
      break;

      case 39:
      case 68:
        IO.rightReleased();
      break;

      case 38:
      case 87:
        IO.upReleased();
      break;

      case 40:
      case 83:
        IO.downReleased();
      break;

      case 32:
        IO.actionReleased();
      break;

      case 13:
        IO.enter();
      break;

      default:
      return
    }
    e.preventDefault();
  },

  leftPressed: function () {
    if (!IO.intLeft) {
      IO.intLeft = setInterval(IO.left, OPTIONS.KEY_INTERVAL);
      IO.leftStart();
    }
  },

  leftReleased: function () {
    clearInterval(IO.intLeft);
    IO.intLeft = null;
    IO.leftEnd();
  },

  rightPressed: function () {
    if (!IO.intRight) {
      IO.intRight = setInterval(IO.right, OPTIONS.KEY_INTERVAL);
      IO.rightStart();
    }
  },

  rightReleased: function () {
    clearInterval(IO.intRight);
    IO.intRight = null;
    IO.rightEnd();
  },

  upPressed: function () {
    if (!IO.intUp) {
      IO.intUp = setInterval(IO.up, OPTIONS.KEY_INTERVAL);
      IO.upStart();
    }
  },

  upReleased: function () {
    clearInterval(IO.intUp);
    IO.intUp = null;
    IO.upEnd();
  },

  downPressed: function () {
    if (!IO.intDown) {
      IO.intDown = setInterval(IO.down, OPTIONS.KEY_INTERVAL);
      IO.downStart();
    }
  },

  downReleased: function () {
    clearInterval(IO.intDown);
    IO.intDown = null;
    IO.downEnd();
  },

  actionPressed: function () {
    if (IO.allowAction) {
      IO.action();
      IO.allowAction = false;
    }
  },

  actionReleased: function () {
    IO.allowAction = true;
  },

  resetEvents: function () {
    IO.downReleased();
    IO.upReleased();
    IO.leftReleased();
    IO.rightReleased();
    IO.actionReleased();

    IO.action = function () {};
    IO.left = function () {};
    IO.right = function () {};
    IO.up = function () {};
    IO.down = function () {};
    IO.enter = function () {};
  }

}
