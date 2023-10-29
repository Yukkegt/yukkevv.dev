window.addEventListener('load', () => {
    const hasVisited = localStorage.getItem('hasVisited');
  
    if (!hasVisited) {
      showLoadingScreen();
  
      localStorage.setItem('hasVisited', 'true');
    }
  });
  
  // ローディング画面を表示する
  function showLoadingScreen() {
    const splashElement = document.getElementById('splash');
    if (splashElement) {
      splashElement.style.display = 'block';
    }
  }
  
  // ページが完全に読み込まれた後
  document.addEventListener('DOMContentLoaded', () => {
    const splashElement = document.getElementById('splash');
    if (splashElement) {
      splashElement.style.display = 'none';
    }
  });
  