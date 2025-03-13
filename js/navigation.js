/**
 * ナビゲーション機能
 * セクション間のナビゲーションとスクロール管理を担当
 */

// 即時実行関数でラップして内部関数のスコープを保護しつつ必要な関数を公開
(function() {
  // DOM読み込み完了後に初期化
  document.addEventListener('DOMContentLoaded', function() {
    console.log('ナビゲーション初期化開始');
    initNavigation();
  });

  /**
   * ナビゲーションバーの機能を初期化
   */
  function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    console.log('ナビゲーションアイテム数:', navItems.length);
    
    // クリック・タップイベントの追加（イベントデリゲーションを使用）
    const navContainer = document.querySelector('.progress-nav');
    if (navContainer) {
      // イベントデリゲーションでナビゲーションコンテナにイベントを設定
      navContainer.addEventListener('click', function(e) {
        // クリックされた要素またはその親要素がnav-itemクラスを持つか確認
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
          console.log('ナビアイテムがクリックされました');
          navigateToSection(navItem);
        }
      });
      
      // モバイル用タッチイベント
      navContainer.addEventListener('touchend', function(e) {
        const navItem = e.target.closest('.nav-item');
        if (navItem) {
          e.preventDefault();
          console.log('ナビアイテムがタップされました');
          navigateToSection(navItem);
        }
      });
    } else {
      console.error('ナビゲーションコンテナが見つかりません');
    }
    
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
    console.log('移動先セクション:', targetSection);
    
    if (!targetSection) {
      console.error('移動先セクションが指定されていません');
      return;
    }
    
    // 対応するセクションの最初の要素を探す
    const targetElements = document.querySelectorAll(`[data-section="${targetSection}"]`);
    console.log('対象要素数:', targetElements.length);
    
    if (targetElements.length > 0) {
      // スムーズスクロール実行
      targetElements[0].scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      // アクティブ状態の更新
      updateNavActiveState(item);
    } else {
      console.error(`セクション "${targetSection}" の要素が見つかりません`);
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

  // グローバルスコープに必要な関数を公開
  window.initNavigation = initNavigation;
  window.navigateToSection = navigateToSection;
  
  // 安全策：ページ読み込み完了時のフォールバック初期化
  window.addEventListener('load', function() {
    // DOMContentLoadedが失敗した場合のバックアップ
    if (!document.querySelector('.nav-item.active')) {
      console.log('ロード時のフォールバック初期化');
      initNavigation();
    }
  });
})();

// 即時実行の直接初期化（最も確実な方法）
(function() {
  // ページがすでに読み込まれている場合のための即時初期化
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('ページ読み込み済み - 即時初期化');
    setTimeout(function() {
      if (typeof initNavigation === 'function') {
        initNavigation();
      }
    }, 100);
  }
})();
