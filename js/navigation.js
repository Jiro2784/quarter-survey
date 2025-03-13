/**
 * ナビゲーション機能
 * セクション間のナビゲーションとスクロール管理を担当
 */

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
  
  // クリック・タップイベントの追加
  navItems.forEach(item => {
    // クリックイベント
    item.addEventListener('click', function(e) {
      e.preventDefault(); // 重要: デフォルト動作を防止
      console.log('ナビアイテムがクリックされました:', this.getAttribute('data-section'));
      navigateToSection(this);
    });
    
    // タッチイベント（モバイル用）
    item.addEventListener('touchend', function(e) {
      e.preventDefault(); // 重要: デフォルト動作を防止
      console.log('ナビアイテムがタップされました:', this.getAttribute('data-section'));
      navigateToSection(this);
    });
  });
}

/**
 * 指定されたセクションに移動
 * @param {HTMLElement} item - クリックされたナビゲーション項目
 */
function navigateToSection(item) {
  const targetSection = item.getAttribute('data-section');
  console.log('移動先セクション:', targetSection);
  
  if (!targetSection) {
    console.error('セクション属性が見つかりません');
    return;
  }
  
  // 対応するセクションの最初の要素を探す (重要な修正: 最初の要素のみを取得)
  const firstElement = document.querySelector(`[data-section="${targetSection}"]`);
  console.log('対象要素:', firstElement);
  
  if (firstElement) {
    // スクロール処理の強化
    try {
      // 方法1: scrollIntoView
      firstElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      // 方法2: バックアップとしてwindow.scrollToも使用
      const rect = firstElement.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetY = rect.top + scrollTop - 50; // ヘッダー分を調整
      
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
      
      console.log('スクロール実行:', targetY);
      
      // アクティブ状態の更新
      updateNavActiveState(item);
    } catch (error) {
      console.error('スクロールエラー:', error);
    }
  } else {
    console.error(`セクション "${targetSection}" の要素が見つかりません`);
    // すべてのdata-section属性を持つ要素をログ
    console.log('利用可能なセクション:', Array.from(document.querySelectorAll('[data-section]')).map(el => el.getAttribute('data-section')));
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

// グローバルスコープに公開
window.initNavigation = initNavigation;
window.navigateToSection = navigateToSection;

// 特定のセレクタの確認をログに出力（デバッグ用）
console.log('ナビゲーション要素:', document.querySelectorAll('.nav-item').length);
console.log('セクション要素:', Array.from(document.querySelectorAll('[data-section]')).map(el => el.getAttribute('data-section')));
