/**
 * ナビゲーション機能
 * セクション間のナビゲーションとスクロール管理を担当
 */

// DOM読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
});

/**
 * ナビゲーションバーの機能を初期化
 */
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  // クリック・タップイベントの追加
  navItems.forEach(item => {
    // クリックイベント
    item.addEventListener('click', function() {
      navigateToSection(this);
    });
    
    // タッチイベント（モバイル用）
    item.addEventListener('touchend', function(e) {
      e.preventDefault();
      navigateToSection(this);
    });
  });
  
  // スクロールイベントリスナーの設定
  setupScrollListener();
  
  // 初期状態の更新
  updateActiveNavItem();
}

/**
 * 指定されたセクションに移動
 * @param {HTMLElement} item - クリックされたナビゲーション項目
 */
function navigateToSection(item) {
  const targetSection = item.getAttribute('data-section');
  if (!targetSection) return;
  
  // 対応するセクションの最初の要素を探す
  const targetElements = document.querySelectorAll(`[data-section="${targetSection}"]`);
  
  if (targetElements.length > 0) {
    // スムーズスクロール実行
    targetElements[0].scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
    
    // アクティブ状態の更新
    updateNavActiveState(item);
  }
}

/**
 * ナビゲーション項目のアクティブ状態を更新
 * @param {HTMLElement} activeItem - アクティブにする項目
 */
function updateNavActiveState(activeItem) {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(navItem => {
    navItem.classList.remove('active');
  });
  
  if (activeItem) {
    activeItem.classList.add('active');
  }
}

/**
 * スクロールイベントリスナーのセットアップ
 */
function setupScrollListener() {
  let scrollTimeout;
  
  window.addEventListener('scroll', function() {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveNavItem, 100);
  });
}

/**
 * スクロール位置に基づいてアクティブなナビゲーション項目を更新
 */
function updateActiveNavItem() {
  const viewportHeight = window.innerHeight;
  
  // セクションごとの要素を収集
  const sections = {
    store: Array.from(document.querySelectorAll('[data-section="store"]')),
    rating: Array.from(document.querySelectorAll('[data-section="rating"]')),
    info: Array.from(document.querySelectorAll('[data-section="info"]')),
    service: Array.from(document.querySelectorAll('[data-section="service"]')),
    feedback: Array.from(document.querySelectorAll('[data-section="feedback"]'))
  };
  
  let mostVisibleSection = 'store';
  let maxVisibility = 0;
  
  // 各セクションの可視性をチェック
  for (const section in sections) {
    const elements = sections[section];
    if (elements.length === 0) continue;
    
    let sectionVisibility = 0;
    
    // セクション内の各要素の可視性を計算
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const rect = element.getBoundingClientRect();
      
      if (rect.top < viewportHeight && rect.bottom > 0) {
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        const elementVisibility = visibleHeight / rect.height;
        sectionVisibility += elementVisibility;
      }
    }
    
    // 最も可視性の高いセクションを記録
    if (sectionVisibility > maxVisibility) {
      maxVisibility = sectionVisibility;
      mostVisibleSection = section;
    }
  }
  
  // アクティブなナビゲーション項目を更新
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const itemSection = item.getAttribute('data-section');
    if (itemSection === mostVisibleSection) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// グローバルスコープに公開
window.initNavigation = initNavigation;
