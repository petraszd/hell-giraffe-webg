function main() {
  var textures = ['giraffe.jpg', 'ground.jpg', 'shadow.png', 'carrot.jpg'];
  var geometries = ['giraffe', 'ground', 'shadow', 'carrot'];

  try {
    new Float32Array(1);
  } catch (e) {
    showBadBrowserError();
    return;
  }

  document.getElementById('message').style.display = 'block';
  ResourceManager.onEnd = function () {
    IO.init();
    SceneManager.init();
    setInterval(SceneManager.mainLoop, OPTIONS.RENDER_INTERVAL);
    document.getElementById('message').style.display = 'none';
  };
  ResourceManager.load(textures, geometries);
}

function showBadBrowserError()
{
  document.getElementById('error').style.display = 'block';
}
